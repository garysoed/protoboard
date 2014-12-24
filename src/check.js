import Utils from 'src/utils';

// Private symbols.
const __addChecked__ = Symbol();
const __checked__ = Symbol();
const __input__ = Symbol();
const __value__ = Symbol();

class Continuation {

  [__addChecked__](checked) {
    return new Continuation(
        this[__input__], 
        this[__value__], 
        this[__checked__].concat(checked));
  }

  constructor(input, value = undefined, checked = []) {
    this[__checked__] = checked;
    this[__input__] = input;
    this[__value__] = value;
  }

  isInt(radix = 10) {
    let output = Number.parseInt(this[__input__], radix);
    if (Number.isNaN(output)) {
      return this[__addChecked__](`int(radix = ${radix})`);
    }

    return new Continuation(this[__input__], output);
  }

  isBoolean() {
    return new Continuation(this[__input__], this[__input__].toLowerCase() === 'true');
  }

  orThrows(msg) {
    if (this[__value__] === undefined) {
      if (!msg) {
        msg = `Illegal Exception. Checked: ${this[__checked__].join(', ')} ` +
            `but was ${this[__input__]}`;
      }
      throw msg;
    } else {
      return this[__value__];
    }
  }

  orUse(backup) {
    return (this[__value__] === undefined) ? backup : this[__value__];
  }
}

function check(input) {
  return new Continuation(input);
}

export default check;

Utils.makeGlobal('pb.Check', check);
