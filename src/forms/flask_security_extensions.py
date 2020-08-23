from flask_security.forms import ConfirmRegisterForm, LoginForm
from wtforms import StringField
from flask_security.forms import Required


class ExtendedRegisterForm(ConfirmRegisterForm):
    username = StringField("Username", [Required()])


class ExtendedLoginForm(LoginForm):
    email = StringField("Username or Email Address")
    username = StringField("Username")

    def validate(self):
        from flask_security.utils import (
            _datastore,
            get_message,
            hash_password,
        )
        from flask_security.confirmable import requires_confirmation

        if not super(LoginForm, self).validate():
            return False

        # try login using email
        self.user = _datastore.get_user(self.email.data)

        # if that didn't work try log in using the username
        if self.user is None:
            self.user = _datastore.get_user(self.username.data)

        if self.user is None:
            self.email.errors.append(get_message("USER_DOES_NOT_EXIST")[0])
            # Reduce timing variation between existing and non-existing users
            hash_password(self.password.data)
            return False
        if not self.user.password:
            self.password.errors.append(get_message("PASSWORD_NOT_SET")[0])
            # Reduce timing variation between existing and non-existing users
            hash_password(self.password.data)
            return False
        if not self.user.verify_and_update_password(self.password.data):
            self.password.errors.append(get_message("INVALID_PASSWORD")[0])
            return False
        if requires_confirmation(self.user):
            self.email.errors.append(get_message("CONFIRMATION_REQUIRED")[0])
            return False
        if not self.user.is_active:
            self.email.errors.append(get_message("DISABLED_ACCOUNT")[0])
            return False
        return True
