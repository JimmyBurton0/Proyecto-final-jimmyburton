from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Role, Product, Compatibility, Cart, CartItem
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import requests

api = Blueprint('api', __name__)
CORS(api)

def is_admin(user_id):
    try:
        user = User.query.get(int(user_id))
        return user and user.role and user.role.name.lower() == 'administrador'
    except Exception as e:
        print(f"Error en is_admin: {str(e)}")
        return False

@api.route('/signup', methods=['POST'])
def handle_signup():
    body = request.get_json()
    if not body: return jsonify({"msg": "Información insuficiente"}), 400
    
    email = body.get('email', '').lower().strip()
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "El correo ya está registrado"}), 400

    role = Role.query.filter_by(name='comprador').first()
    if not role:
        role = Role(name='comprador')
        db.session.add(role)
        db.session.commit()

    new_user = User(
        fullName=body.get('fullName'),
        email=email,
        passwordHash=generate_password_hash(body.get('password')),
        roleId=role.id
    )
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"msg": "Usuario creado", "token": create_access_token(identity=str(new_user.id))}), 201

@api.route('/login', methods=['POST'])
def handle_login():
    body = request.get_json()
    if not body: return jsonify({"msg": "Datos no proporcionados"}), 400
    
    user = User.query.filter_by(email=body.get('email', '').lower().strip()).first()
    if not user or not check_password_hash(user.passwordHash, body.get('password')):
        return jsonify({"msg": "Credenciales inválidas"}), 401

    return jsonify({
        "token": create_access_token(identity=str(user.id)),
        "user": user.serialize()
    }), 200

@api.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([p.serialize() for p in products]), 200

@api.route('/products/<int:id>', methods=['GET'])
def get_product_detail(id):
    product = Product.query.get(id)
    if not product: return jsonify({"msg": "No encontrado"}), 404
    return jsonify(product.serialize()), 200

@api.route('/search', methods=['GET'])
def search_products():
    name = request.args.get('name')
    model = request.args.get('model')
    query = Product.query
    if name: query = query.filter(Product.name.ilike(f'%{name}%'))
    if model: query = query.join(Compatibility).filter(Compatibility.carModel.ilike(f'%{model}%'))
    return jsonify([p.serialize() for p in query.all()]), 200

@api.route('/exchange-rate', methods=['GET'])
def get_exchange_rate():
    try:
        response = requests.get("https://open.er-api.com/v6/latest/USD", timeout=5)
        rate = response.json()["rates"].get("VES", 36.50)
        return jsonify({"rate": rate}), 200
    except:
        return jsonify({"rate": 36.50, "status": "fixed"}), 200

@api.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    body = request.get_json()
    product_id = body.get("productId")
    quantity = int(body.get("quantity", 1))

    product = Product.query.get(product_id)
    if not product or product.stockQuantity < quantity:
        return jsonify({"msg": "Stock insuficiente o producto inexistente"}), 400

    cart = Cart.query.filter_by(userId=user_id).first()
    if not cart:
        cart = Cart(userId=user_id)
        db.session.add(cart)
        db.session.commit()

    item = CartItem.query.filter_by(cartId=cart.id, productId=product_id).first()
    if item:
        item.quantity += quantity
    else:
        item = CartItem(cartId=cart.id, productId=product_id, quantity=quantity)
        db.session.add(item)
    
    db.session.commit()
    return jsonify({"msg": "Añadido al carrito"}), 200

@api.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    cart = Cart.query.filter_by(userId=user_id).first()
    if not cart: return jsonify([]), 200
    
    items = CartItem.query.filter_by(cartId=cart.id).all()
    output = []
    for item in items:
        prod = Product.query.get(item.productId)
        if prod:
            output.append({
                "itemId": item.id,
                "productId": prod.id,
                "name": prod.name,
                "priceUsd": str(prod.priceUsd),
                "quantity": item.quantity,
                "subtotal": str(float(prod.priceUsd) * item.quantity)
            })
    return jsonify(output), 200

@api.route('/products', methods=['POST'])
@jwt_required()
def add_product():
    user_id = get_jwt_identity()
    if not is_admin(user_id): 
        return jsonify({"msg": "Acceso denegado: Se requiere ser administrador"}), 403
    
    body = request.get_json()
    if not body:
        return jsonify({"msg": "Datos no proporcionados"}), 400

    try:
        required_fields = ['name', 'priceUsd', 'categoryId']
        for f in required_fields:
            if f not in body or body[f] == "":
                return jsonify({"msg": f"El campo {f} es obligatorio"}), 400

        new_prod = Product(
            name=body.get('name'), 
            brand=body.get('brand'),
            priceUsd=float(body.get('priceUsd')), 
            stockQuantity=int(body.get('stockQuantity', 0)),
            categoryId=int(body.get('categoryId')),
            yearStart=int(body.get('yearStart')) if body.get('yearStart') else None,
            yearEnd=int(body.get('yearEnd')) if body.get('yearEnd') else None,
            vehicleType=body.get('vehicleType', 'carro'),
            isOriginal=bool(body.get('isOriginal', False)),
            condition=body.get('condition', 'nuevo'),
            sellerId=int(user_id) 
        )
        db.session.add(new_prod)
        db.session.commit()
        return jsonify(new_prod.serialize()), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error guardando producto: {str(e)}")
        return jsonify({"msg": "Error al guardar el producto", "error": str(e)}), 400

@api.route('/products/<int:id>', methods=['PUT', 'DELETE'])
@jwt_required()
def manage_product(id):
    user_id = get_jwt_identity()
    
    if not is_admin(user_id): 
        return jsonify({"msg": "No autorizado: Requiere privilegios de administrador"}), 403
        
    product = Product.query.get(id)
    if not product: 
        return jsonify({"msg": "Producto no encontrado"}), 404

    if request.method == 'PUT':
        body = request.get_json()
        if not body: return jsonify({"msg": "Sin datos para actualizar"}), 400
        
        fields = [
            'name', 'brand', 'priceUsd', 'stockQuantity', 
            'categoryId', 'yearStart', 'yearEnd', 
            'vehicleType', 'isOriginal', 'condition'
        ]
        
        try:
            for key in fields:
                if key in body:
                    val = body[key]
                    if key == 'priceUsd': val = float(val)
                    if key in ['stockQuantity', 'categoryId', 'yearStart', 'yearEnd']:
                        val = int(val) if val else None
                    setattr(product, key, val)
            
            db.session.commit()
            return jsonify(product.serialize()), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"msg": "Error actualizando datos", "error": str(e)}), 400

    if request.method == 'DELETE':
        try:
            CartItem.query.filter_by(productId=id).delete()
            
            db.session.delete(product)
            db.session.commit()
            return jsonify({"msg": "Producto eliminado exitosamente"}), 200
        except Exception as e:
            db.session.rollback()
            print(f"Error en DELETE: {str(e)}")
            return jsonify({"msg": "No se pudo eliminar el producto", "error": str(e)}), 400