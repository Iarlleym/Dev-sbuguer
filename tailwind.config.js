/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"], /*Qual quaer arquivo dentro da pasta raiz ou dentro de outra pasta com .html e .js ele vai pegar*/
  theme: {
    fontFamily:{
        'sans':['Poppins', 'sans-serif'] /*Configura a nova fonte baixada ROBOTO como padrão, caso não der cero fica com sans serif */
    },
    extend: {
      backgroundImage: {
        "home": "url('/assets/bg.png')" /* Cria uma propriedade chamada home que muda o background */
      }
    },
  },
  plugins: [],
}

