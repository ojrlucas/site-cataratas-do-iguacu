(function () {
  try {
    var salvo = localStorage.getItem('cpi_tema');
    var escuro = salvo ? salvo === 'escuro' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-tema', escuro ? 'escuro' : 'claro');
  } catch (e) {
    document.documentElement.setAttribute('data-tema', 'claro');
  }
})();
