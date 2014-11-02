let As = {
  int(input, radix = 10) {
    let output = Number.parseInt(input, radix);
    if (Number.isNaN(output)) {
      throw `${input} is not an integer with radix ${radix}`;
    }

    return output;
  }
};

export default As = As;

if (!window.pb) {
  window.pb = {};
}

window.pb.As = As;
