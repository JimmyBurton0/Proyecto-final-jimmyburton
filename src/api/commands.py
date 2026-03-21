
import click
from api.models import db, User, Role


def setup_commands(app):
    
    @app.cli.command("setup-db")
    def setup_db():
        
        print("Iniciando limpieza de base de datos...")
        db.drop_all()
        print("Creando tablas nuevas...")
        db.create_all()

        print("Insertando roles por defecto...")
        # Creamos los roles que tu sistema necesita para funcionar
        role_comprador = Role(name="comprador")
        role_admin = Role(name="admin")

        try:
            db.session.add(role_comprador)
            db.session.add(role_admin)
            db.session.commit()
            print("¡Éxito! Roles 'comprador' y 'admin' creados correctamente.")
        except Exception as e:
            db.session.rollback()
            print(f"Error al insertar roles: {str(e)}")

    @app.cli.command("insert-test-users")
    @click.argument("count")
    def insert_test_users(count):
        """
        Comando opcional para insertar usuarios de prueba vinculados al rol comprador
        """
        print(f"Creando {count} usuarios de prueba...")
        role = Role.query.filter_by(name="comprador").first()
        
        if not role:
            print("Error: El rol 'comprador' no existe. Ejecuta primero 'flask setup-db'")
            return

        for x in range(1, int(count) + 1):
            user = User(
                fullName=f"Test User {x}",
                email=f"test{x}@example.com",
                passwordHash="hash_de_prueba", # En producción usa generate_password_hash
                roleId=role.id
            )
            db.session.add(user)
        
        db.session.commit()
        print(f"Se han creado {count} usuarios vinculados al rol {role.name}")