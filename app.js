const form = document.querySelector('form');
const errors = document.querySelector('.errors');

// --------- Validations rules

function checkWithoutNumbers({ message = 'You have number in your field' } = {}) {
  return ({ value }) => {
    if (!value || typeof value !== 'string') return undefined;
    return value.search(/\d/gi) > -1 ? message : undefined;
  };
}

function checkRequiredString({ message = 'Field is Required' } = {}) {
  return ({ value }) => {
    if (typeof value !== 'string') return undefined;
    return !value.length ? message : undefined;
  };
}

function checkEmail({ message = 'Email is not valid' } = {}) {
  return ({ value }) => {
    if (!value || typeof value !== 'string') return undefined;

    const emailRegExp = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

    return value.search(emailRegExp) > -1 ? undefined : message;
  };
}

function checkMinLength({ count, message = `String less then ${count || '-'}` } = {}) {
  return ({ value }) => {
    if (!value || typeof value !== 'string' || !count) return undefined;
    return value.length < count ? message : undefined;
  };
}

// we can add other rules...


// --------- Handler
function compose(...functions) {
  return ({ value }) => {
    return functions.reduce((acc, fnc) => {
      const error = fnc({ value });

      if (error) {
        return [...acc, error];
      }

      return acc;
    }, []);
  };
}

// --------- Validations schema

const validationSchema = {
  firstName: compose(
    checkRequiredString({ message: `First Name - Field is Required` }),
    checkWithoutNumbers({ message: `First Name - You have number in your field` }),
  ),
  lastName: compose(
    checkRequiredString({ message: `Last Name - Field is Required` }),
    checkWithoutNumbers({ message: `Last Name - You have number in your field` }),
  ),
  email: checkEmail(),
  password: compose(
    checkRequiredString({ message: `Password - Field is Required` }),
    checkMinLength({
      count: 8,
      message: `Password - should be more then 8 chars`,
    }),
  ),
};

// ----------- Form validation
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const errorMessages = [];

  for (let formElement of e.target) {
    if (formElement.tagName.toLowerCase() === 'input') {
      const formError = validationSchema?.[formElement?.name || '']?.({ value: formElement?.value });

      const isNeedAddErrorMessage = Array.isArray(formError) ? !!formError.length : !!formError;

      if (isNeedAddErrorMessage) {
        errorMessages.push(formError);
      }
    }
  }

  if (errorMessages.length > 0) {
    e.preventDefault();
    errors.innerText = errorMessages.join('\n');
  } else {
    errors.innerText = '';

    // some actions
  }
});
