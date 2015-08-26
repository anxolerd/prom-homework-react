(function () {
  var ChangePasswordForm = React.createClass({
    displayName: "ChangePasswordForm",
    getInitialState: function() {
      return {
        strengthStr: '',

        username: '',

        oldPassword: '',
        newPassword: '',
        confirmedPassword: '',

        errorNewPassword: '',
        errorConfirmedPassword: '',
        errorUsername: '',
        errorOldPassword: '',

        isFormValid: false,
      };
    },

    checkValid: function(newState) {
      var state = this.state;
      for (var key in newState) {
        state[key] = newState[key];
      }
      var newState = {
        isFormValid: state.username && state.oldPassword && state.newPassword && state.confirmedPassword && !state.errorNewPassword && !state.errorRepeatPassword && !state.errorUsername,
      };
      this.setState(newState);
    },

    checkUsername: function(e) {
      var newState = {
        username: e.target.value.trim(), 
      };
      newState.errorUsername = newState.username.length === 0 ? 'Username cannot be empty' : '';
      this.setState(newState);
      state = this.state;
      this.checkValid(newState);
    },

    setOldPassword: function(e) {
      var newState = {
        oldPassword: e.target.value,
        errorOldPassword: e.target.value.trim().length === 0 ? 'Password cannot be empty' : '',
      }
      this.setState(newState);

      if (!newState.errorOldPassword) { 
        this.checkOldNew(oldPwd = newState.oldPassword);  
      }

      this.checkValid(newState);
    },

    setNewPassword: function(e) {
      var newState = {
        newPassword: e.target.value,
        errorNewPassword: e.target.value.trim().length === 0 ? 'Password cannot be empty' : '',
      }
      this.setState(newState);
      this.checkStrength(newState.newPassword);

      if (!newState.errorOldPassword) { 
        !this.checkOldNew(undefined, newPwd = newState.newPassword) || this.checkNewConfirmed(newPwd = newState.newPassword, undefined);
      }

      this.checkValid(newState);
    },

    setConfirmedPassword: function(e) {
      var newState = {
        confirmedPassword: e.target.value,
        errorConfirmedPassword: e.target.value.trim().length === 0 ? 'Password cannot be empty' : '',
      }
      this.setState(newState);

      if (!newState.errorConfirmedPassword) { 
        this.checkNewConfirmed(undefined, conPwd = newState.confirmedPassword);
      }

      this.checkValid(newState);
    },
   
    checkStrength: function(pass) {
      var complexity = 0;
      if (/[a-zа-яґєїі]/.test(pass)) {complexity++};
      if (/[A-ZА-ЯҐЄЇІ]/.test(pass)) {complexity++};
      if (/[0-9]/.test(pass)) {complexity++};
      if (/[\!\?,\.@%$#№\*~`]/.test(pass)) {complexity++};
      if (pass.length > 7) {complexity++};
      var strength;
      switch(complexity) {
        case 0:
          strength='WAT?';
          break;
        case 1:
          strength='Weak password';
          break;
        case 2:
          strength='Still weak password';
          break;
        case 3:
          strength='Your password is getting stronger';
          break;
        case 4:
          strength='Wow, you have a good password!';
          break;
        case 5:
          strength='Your password is extrastrong';
          break;
        default:
          strength='How could this happen?';
          break;
      }
      this.setState({strengthStr: strength});
    },

    checkOldNew: function(oldPwd, newPwd) {
      if (typeof(oldPwd) === "undefined") { var oldPwd = this.state.oldPassword; }
      if (typeof(newPwd) === "undefined") { var newPwd = this.state.newPassword; }
      if (oldPwd === newPwd) {
        this.setState({errorNewPassword: 'New password must be different from the old one'});
        return false;
      }
      this.setState({errorNewPassword: ''});
      return true;
    },

    checkNewConfirmed: function(newPwd, conPwd) {
      if (typeof(newPwd) === "undefined") { var newPwd = this.state.newPassword; }
      if (typeof(conPwd) === "undefined") { var conPwd = this.state.confirmedPassword; }
      if (newPwd !== conPwd) {
        this.setState({errorConfirmedPassword: 'Passwords do not match'});
        return false;
      }
      this.setState({errorConfirmedPassword: ''});
      return true;
    },
 
    render: function() {
      return (
        React.DOM.form(null,
          React.DOM.input({type: 'text', placeholder: 'username', value: this.state.username, onChange: this.checkUsername}),
          React.DOM.span({className: "error"}, this.state.errorUsername),
          React.createElement(PasswordField, {placeholder: 'old password', value: this.state.oldPassword, onChange: this.setOldPassword, error: this.state.errorOldPassword}),
          React.createElement(PasswordField, {placeholder: 'new password', value: this.state.newPassword, onChange: this.setNewPassword, error: this.state.errorNewPassword}),
          React.DOM.span({text: '', className: 'strengthStr'}, this.state.strengthStr),
          React.createElement(PasswordField, {placeholder: 'repeat password', value: this.state.confirmedPassword, onChange: this.setConfirmedPassword, error: this.state.errorConfirmedPassword}),
          React.DOM.input({type: 'submit', value: 'change password', disabled: (this.state.isFormValid ? false : 'disabled')})
        )
      );
    }
  })

  var PasswordField = React.createClass({
    displayName: "PasswordField",
    getInitialState: function() {
      return {
        fieldType: "password",
        passwordStrength: 0,
        glyph: "show",
        value: '',
      }
    },
    togglePasswordVisibility: function(e) {
      newState = {};
      if (e.target.checked) {
        newState.fieldType = "text";
        newState.glyph = "hide";
      } else {
        newState.fieldType = "password";
        newState.glyph = "show"
      }
      this.setState(newState);
    },
    render: function() {
      return (
        React.DOM.div({className: "container"},
          React.DOM.input({type: this.state.fieldType, placeholder: this.props.placeholder, value: this.props.value, onChange: this.props.onChange}),
          React.DOM.label(null, this.state.glyph,
            React.DOM.input({type: "checkbox", onClick: this.togglePasswordVisibility})
          ),
          React.DOM.span({className: "error"}, this.props.error)
        )
      );
    },
  });
  React.render(React.createElement(ChangePasswordForm, null), document.getElementById('change-password-form'));
})();
