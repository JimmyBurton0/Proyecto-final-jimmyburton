from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Role
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

api = Blueprint('api', __name__)

CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    responseBody = {
        "message": "Hello! I'm a message that came from the backend"
    }
    return jsonify(responseBody), 200

@api.route('/signup', methods=['POST'])
def handle_signup():
    body = request.get_json()

    if body is None:
        return jsonify({"msg": "No se envió un cuerpo JSON"}), 400
    
    requiredFields = ["email", "password", "fullName"]
    for field in requiredFields:
        if field not in body or not body[field]:
            return jsonify({"msg": f"El campo {field} es obligatorio"}), 400

    userEmail = body['email'].lower()

    userExists = User.query.filter_by(email=userEmail).first()
    if userExists:
        return jsonify({"msg": "El correo electrónico ya está registrado"}), 400

    defaultRole = Role.query.filter_by(name='comprador').first()

    if not defaultRole:
        try:
            defaultRole = Role(name='comprador')
            db.session.add(defaultRole)
            db.session.commit()
        except Exception as e:
            return jsonify({"msg": "Error creando el rol por defecto", "error": str(e)}), 500

    hashedPassword = generate_password_hash(body['password'])

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
            "msg": "Usuario registrado exitosamente como comprador",
            "token": accessToken,
            "user": newUser.serialize()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error interno del servidor", "error": str(e)}), 500

@api.route('/login', methods=['POST'])
def handle_login():
    body = request.get_json()

    if body is None:
        return jsonify({"msg": "No se envió un cuerpo JSON"}), 400
    
    requiredFields = ["email", "password"]
    for field in requiredFields:
        if field not in body or not body[field]:
            return jsonify({"msg": f"El campo {field} es obligatorio"}), 400

    userEmail = body['email'].lower()
    userExists = User.query.filter_by(email=userEmail).first()

    if not userExists:
        return jsonify({"msg": "Usuario o contraseña incorrectos"}), 401

    passwordMatch = check_password_hash(userExists.passwordHash, body['password'])

    if not passwordMatch:
        return jsonify({"msg": "Usuario o contraseña incorrectos"}), 401

    accessToken = create_access_token(identity=str(userExists.id))

    return jsonify({
        "msg": "Login exitoso",
        "token": accessToken,
        "user": userExists.serialize()
    }), 200