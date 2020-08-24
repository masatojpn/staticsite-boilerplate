const NAMESPACE_2020 = NAMESPACE_2020 || {};

(function (_) {
  const _init = () => {
    _message('WORLD');
  };

  const _message = (message) => {
    console.log(`HELLO, ${message}`);
  }

  _.init = _init();
})(NAMESPACE_2020);

NAMESPACE_2020.init;