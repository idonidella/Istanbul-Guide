const validationMessages = {
    isNameValid:
      'İsim en az 3 karakter uzunluğunda olmalı ve sadece harflerden oluşmalıdır.',
    isSurnameValid:
      'Soyisim en az 2 karakter uzunluğunda olmalı ve sadece harflerden oluşmalıdır.',
    isEmailValid: 'Geçerli bir E-Posta adresi giriniz.',
    Passwordatleast: 'Şifre en az',
    most: 'en fazla',
    hastobeacharacter: 'karakter uzunluğunda olmalıdır.',
    isPasswordValid:
      'Şifre büyük harf, küçük harf, sayı ve özel karakter içermelidir.',
    isPasswordCompare: 'Şifreler eşleşmiyor.',
    isPhoneNumberValid: 'Telefon numarası "+", ülke kodu ve 8-15 rakam içermelidir.',
    isUsernameValid:
      'Kullanıcı adı en az 3, en fazla 30 karakter uzunluğunda olmalıdır.',
    requiredValid:
      'Lütfen tüm alanların eksiksiz olarak doldurduğunuza emin olun!',
  };
  
  const validators = {
    isNameValid(name) {
      const trimmedName = name.trim();
      if (
        !/^[A-Za-zÇçĞğİıÖöŞşÜü\s]+$/.test(trimmedName) ||
        trimmedName.length < 3
      ) {
        throw new Error(validationMessages.isNameValid);
      }
    },
    isSurnameValid(surname) {
      const trimmedSurname = surname.trim();
      if (
        !/^[A-Za-zÇçĞğİıÖöŞşÜü\s]+$/.test(trimmedSurname) ||
        trimmedSurname.length < 2
      ) {
        throw new Error(validationMessages.isSurnameValid);
      }
    },
    isEmailValid(email) {
      if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        throw new Error(validationMessages.isEmailValid);
      }
    },
    isPasswordValid(password, minLength = 8, maxLength = 45) {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*()\-_=+{}[\]:;<>,.?/~]/.test(password);
      const isLengthValid =
        password.length >= minLength && password.length <= maxLength;
  
      if (!isLengthValid) {
        throw new Error(
          `${validationMessages.Passwordatleast} ${minLength} ${validationMessages.most} ${maxLength} ${validationMessages.hastobeacharacter}.`,
        );
      }
      if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
        throw new Error(validationMessages.isPasswordValid);
      }
    },
    isPasswordCompare(password, rePassword) {
      if (password !== rePassword) {
        throw new Error(validationMessages.isPasswordCompare);
      }
    },
    isPhoneNumberValid(phone) {
      const regInternationalFormat = /^\+[0-9]{8,15}$/;
      if (!regInternationalFormat.test(phone)) {
        throw new Error(validationMessages.isPhoneNumberValid);
      }
    },
    isUsernameValid(username) {
      const trimmedUsername = username.trim();
      if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
        throw new Error(validationMessages.isUsernameValid);
      }
    },
    requiredValid(...args) {
      for (let arg of args) {
        if (arg.length === 0) {
          throw new Error(validationMessages.requiredValid);
        }
      }
    },
  };
  
  export default validators;
  