from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Role, PasswordHistory # Añadimos PasswordHistory
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta 

api = Blueprint('api', __name__)

# Permitir peticiones desde el frontend
CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handleHello():
    responseBody = {
        "message": "Hola! Soy un mensaje que viene del backend"
    }
    return jsonify(responseBody), 200

@api.route('/signup', methods=['POST'])
def handleSignup():
    body = request.get_json()

    if body is None:
        return jsonify({"msg": "No se envió información en el cuerpo de la solicitud"}), 400
    
    requiredFields = ["email", "password", "fullName"]
    for field in requiredFields:
        if field not in body or not body[field]:
            return jsonify({"msg": f"El campo {field} es obligatorio"}), 400

    userEmail = body['email'].lower()

    # Verificar si el usuario ya existe
    userExists = User.query.filter_by(email=userEmail).first()
    if userExists:
        return jsonify({"msg": "Este correo electrónico ya está registrado"}), 400

    # Manejar rol por defecto
    defaultRole = Role.query.filter_by(name='comprador').first()

    if not defaultRole:
        try:
            defaultRole = Role(name='comprador')
            db.session.add(defaultRole)
            db.session.commit()
        except Exception as e:
            return jsonify({"msg": "Error al asignar el rol", "error": str(e)}), 500

    hashedPassword = generate_password_hash(body['password'])

    # Crear instancia del usuario
    newUser = User(
        email=userEmail,
        passwordHash=hashedPassword,
        fullName=body['fullName'],
        roleId=defaultRole.id
    )

    try:
        db.session.add(newUser)
        db.session.commit()

        accessToken = create_access_token(identity=str(newUser.id))

        return jsonify({
            "msg": "Usuario registrado exitosamente",
            "accessToken": accessToken,
            "user": newUser.serialize()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Ocurrió un error interno en el servidor", "error": str(e)}), 500

@api.route('/login', methods=['POST'])
def handleLogin():
    body = request.get_json()

    if body is None:
        return jsonify({"msg": "No se recibió la información de inicio de sesión"}), 400
    
    requiredFields = ["email", "password"]
    for field in requiredFields:
        if field not in body or not body[field]:
            return jsonify({"msg": f"El campo {field} es necesario"}), 400

    userEmail = body['email'].lower()
    foundUser = User.query.filter_by(email=userEmail).first()

    if not foundUser:
        return jsonify({"msg": "Correo o contraseña incorrectos"}), 401

    isPasswordCorrect = check_password_hash(foundUser.passwordHash, body['password'])

    if not isPasswordCorrect:
        return jsonify({"msg": "Correo o contraseña incorrectos"}), 401

    accessToken = create_access_token(identity=str(foundUser.id))

    return jsonify({
        "msg": "Inicio de sesión exitoso",
        "accessToken": accessToken,
        "user": foundUser.serialize()
    }), 200

# --- NUEVAS RUTAS PARA RECUPERACIÓN DE CONTRASEÑA ---

@api.route('/recovery-password', methods=['POST'])
def handle_recovery():
    body = request.get_json()
    email = body.get("email")

    if not email:
        return jsonify({"msg": "El correo es obligatorio"}), 400

    user = User.query.filter_by(email=email.lower()).first()
    
    if not user:
        return jsonify({"msg": "Si el correo coincide con nuestros registros, recibirás un token"}), 200

    expires = timedelta(minutes=15)
    recovery_token = create_access_token(identity=str(user.id), expires_delta=expires)
    
    return jsonify({
        "msg": "Token de recuperación generado",
        "recovery_token": recovery_token
    }), 200

@api.route('/reset-password', methods=['POST'])
@jwt_required() 
def handle_reset():
    body = request.get_json()
    new_password = body.get("password")
    user_id = get_jwt_identity()

    if not new_password:
        return jsonify({"msg": "La nueva contraseña es obligatoria"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    # 1. VERIFICACIÓN DE SEGURIDAD: No repetir contraseñas (H-4)
    
    # Revisar contra la contraseña actual
    if check_password_hash(user.passwordHash, new_password):
        return jsonify({"msg": "No puedes usar tu contraseña actual"}), 400
    
    # Revisar contra las últimas 3 del historial
    histories = PasswordHistory.query.filter_by(user_id=user.id).order_by(PasswordHistory.id.desc()).limit(3).all()
    for history in histories:
        if check_password_hash(history.passwordHash, new_password):
            return jsonify({"msg": "No puedes usar una de tus últimas 3 contraseñas"}), 400

    try:
        # 2. Guardar la contraseña que va a ser reemplazada en el historial
        old_password_entry = PasswordHistory(passwordHash=user.passwordHash, user_id=user.id)
        db.session.add(old_password_entry)

        # 3. Actualizar a la nueva contraseña cifrada
        user.passwordHash = generate_password_hash(new_password)
        db.session.commit()
        
        return jsonify({"msg": "Contraseña actualizada exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al actualizar la contraseña", "error": str(e)}), 500