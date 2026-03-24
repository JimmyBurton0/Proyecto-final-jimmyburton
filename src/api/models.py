from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    fullName = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    passwordHash = db.Column(db.String(255), nullable=False)
    roleId = db.Column(db.Integer, db.ForeignKey('role.id'))
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)

    # Relación para acceder al nombre del rol y al historial fácilmente
    role = db.relationship('Role', backref='users')
    password_history = db.relationship('PasswordHistory', backref='user', lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "fullName": self.fullName,
            "email": self.email,
            "role": self.role.name if self.role else None,
            "createdAt": self.createdAt
        }

class PasswordHistory(db.Model):
    __tablename__ = 'password_history'
    id = db.Column(db.Integer, primary_key=True)
    passwordHash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<PasswordHistory {self.id} for User {self.user_id}>'

class Role(db.Model):
    __tablename__ = 'role'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    def __repr__(self):
        return self.name 

class Category(db.Model):
    __tablename__ = 'category'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

    def __repr__(self):
        return self.name

class Product(db.Model):
    __tablename__ = 'product'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    brand = db.Column(db.String(100))
    priceUsd = db.Column(db.Numeric(10, 2), nullable=False)
    stockQuantity = db.Column(db.Integer, default=0)
    categoryId = db.Column(db.Integer, db.ForeignKey('category.id'))
    
    category = db.relationship('Category', backref='products')

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "brand": self.brand,
            "price": str(self.priceUsd),
            "category": self.category.name if self.category else None
        }

class Compatibility(db.Model): 
    __tablename__ = 'compatibility'
    id = db.Column(db.Integer, primary_key=True)
    productId = db.Column(db.Integer, db.ForeignKey('product.id'))
    carBrand = db.Column(db.String(100))
    carModel = db.Column(db.String(100))
    yearStart = db.Column(db.Integer)
    yearEnd = db.Column(db.Integer)

class Cart(db.Model):
    __tablename__ = 'cart'
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('user.id'))

class CartItem(db.Model):
    __tablename__ = 'cart_item'
    id = db.Column(db.Integer, primary_key=True)
    cartId = db.Column(db.Integer, db.ForeignKey('cart.id'))
    productId = db.Column(db.Integer, db.ForeignKey('product.id'))
    quantity = db.Column(db.Integer, nullable=False)