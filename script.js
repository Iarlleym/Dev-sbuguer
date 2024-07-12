const menu = document.getElementById("menu") /*Pega o ID do menu e salva na const menu*/
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("fechar-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("endereco")
const addressWarn = document.getElementById("alerta-de-endereco")
//const spanItem = document.getElementById("date-span")

let cart = []; //Cria um array chamado cart vazio, para salvar os itens da lista dos carrinhos add.

//Função para abrir o carrtinho
cartBtn.addEventListener("click", function(){ /*Cria um evento do tipo click que pega quando eu clicar no botão do carrinho */
    cartModal.style.display = "flex"  /*Acessa os estilos do cartModal e coloca o display flex */
    updateCartModal(); //função quer atualiza o carrinho
}) 

//Função para fechar o carrinho clicando fora.
cartModal.addEventListener("click", function(event){ //com o event vc consegue filtrar se é fora ou dentro do modal
if (event.target === cartModal) {
    cartModal.style.display = "none"
}
})

//Função para o botão fechar do carrihho
closeModalBtn.addEventListener("click", function(){ //com o event vc consegue filtrar se é fora ou dentro do modal
        cartModal.style.display = "none"
    })


//Função para add o item do caerrinho
menu.addEventListener("click", function(event){
    //console.log(event.target) mostra qual item html foi clicado
    let parrentButton = event.target.closest(".add-to-cart-btn") //Verifica se o elemento pai tem a classe desejada, para olhar classe começa com . e id com #
    if (parrentButton){ //se vc clicou no item do carrinho ou o butão proximo faça algo
        const name = parrentButton.getAttribute("data-name") //vem como texto
        const price = parseFloat(parrentButton.getAttribute("data-price")) //vem como texto e converte para float

    //Chama a função para adicionar o nome e o valor no carrinho.
        addToCart(name, price)

    }

})

//Função para add no carrinho

function addToCart(name, price) {

    //Verificar se o item add já está na lista 
    const existingItem = cart.find(item => item.name === name) //procura em cada item da lista e verifica se tem item igual

    if (existingItem){ // Se o item já Existe aumenta a quantidade + 1
        existingItem.quantity += 1; //add + 1 a varialvel quantity
    } 

    else {
    cart.push({ //Puxa e add o nome e o price no array cart criado
        name,
        price,
        quantity: 1,
    })
        }


    // Chamar a função para atualizar o carrinho

    updateCartModal ()


}

//Função para atualizar o carrinho

function updateCartModal () {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => { //função que percore a lista e faz algo

        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add("flex", "justify-between","mb-4","flex-col")

        cartItemElement.innerHTML = `
            <div class= "flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

                <button class="remove-cart-btn" data-name="${item.name}">
                    Remover
                </button>

            </div>
        `

        total += item.price * item.quantity; //faz a multiplicação do valor * a quantidade
        cartItemsContainer.appendChild(cartItemElement) //Coloca o elemento criado dentro do modal do elemento criado.

    }) 

    cartTotal.textContent = total.toLocaleString("pt-BR", { //Mostra o valor da variavel total em R$.
        style: "currency",
        currency: "BRL"
    }); 


    //Atualizar o contador
    cartCounter.innerHTML = cart.length; //Pega a quantidade de items que tem no carrilho

}

//Função para remover o item do carrinho.
cartItemsContainer.addEventListener("click", function (event){ //Verifica se tem o item com a class determinado
    if(event.target.classList.contains("remove-cart-btn")){
        const name = event.target.getAttribute("data-name") //Passa para a variavel name o evento encontrado data-name

        removeItemCart(name); //Função parta remover o item
    }
})

//Função que remove o item

function removeItemCart(name){

    const index = cart.findIndex(item => item.name === name); //Manda a posição que o item está na lista

    if(index !== -1){ //Só manda -1 quando não encontra nada na lista.
        const item = cart[index];//o item recebe a posição que está no carro

        if(item.quantity > 1){ //se a quantidade for maior que 1
            item.quantity -= 1; //remove uma quatidade do item
            updateCartModal(); //Chama a função para atualizar o carrinho
            return; //Para a execução do if
        }

        cart.splice(index, 1); //se existir apenas um item o splice remove o item da lista.
        updateCartModal(); //Chama a função para atualizar o carrinho
    }
}

//Criar a ação para pegar o endereço digitado

addressInput.addEventListener("input", function(event){ //cria um evento de monitoração do input
    let inputValue = event.target.value;
    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

//Finalizar o pedido
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        
        Toastify ({
            text: "Ops... Desculpa o restaurante está fechado no momento.",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
        }
    }).showToast();

        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden") //Remove a classe hidden e mostra o alerta
        addressInput.classList.add("border-red-500")//Adiciona a borda vermelha no alerta
    }

//Enviar o pedido para a api do wpp

const cartItems = cart.map((item) => {
    return(
        ` ${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} |`
    )
}).join("")

const message = encodeURIComponent(cartItems)
const phone = "83981575601"
window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${message} Endereço: ${addressInput.value}`, "_blank")
cart=[];//Limpa o carrinho quando eviar o pedido pelo wpp
updateCartModal();
})

//Verificar se o horario está no horario de funcionamento

function checkRestaurantOpen (){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22; //se o horarioa estiver entre 18 e 22 ele retorna como true

}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();
if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}
else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}