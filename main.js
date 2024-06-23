//! HTML den gelenler
const chatInput = document.querySelector("#chat-input")
const sendButton = document.querySelector("#send-btn")
const defaultText = document.querySelector(".default-text")
const chatContainer = document.querySelector(".chat-container")
const themeButton = document.querySelector("#theme-btn")
const deleteButton = document.querySelector("#delete-btn")

let userText = null

//* Gönderdiğimiz html ve class ismine göre bize bir htmlo oluşturur
const createElement = (html, className) => {
    const chatDiv = document.createElement("div") // Yeni bir div oluşturur
    chatDiv.classList.add("chat", className) // Oluşturulan div e "chat" ve dışarıdan parametre olarak gelen class ı verir

    chatDiv.innerHTML = html // Oluşturduğumuz div in içerisine dışarıdan parametre olarak gelen html parametresini ekle

    return chatDiv
}

const getChatResponse = async (incomingChatDiv) => {
    const pElement = document.createElement("p") // API den gelecek cevabı içerisine aktaracağım bir p etiketi oluşturduk
    console.log(pElement)

    //? 1. adım url i tanımla
    const url = "https://chatgpt-42.p.rapidapi.com/geminipro"

    //? 2. adım options ı tanımla
    const options = {
        method: 'POST', // Atacağımız isteğin tipidir
        //* API key imiz bulunur
        headers: {
            'x-rapidapi-key': '3fe30a3be8mshdb46b05a133f93dp190a8ajsn63a5684de21d',
            'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messages: [
                {
                    role: 'user',
                    content: `${userText}`
                }
            ],
            temperature: 0.9,
            top_k: 5,
            top_p: 0.9,
            max_tokens: 256,
            web_access: false
        })
    };

    //? 3. adım API ye istek at
    //! fetch(url, options)
    //!     .then((res) => res.json()) //  Gelen cevabı yakala ve json a çevir
    //!     .then((data) => console.log(data.result)) // Json a çevrilmiş veriyi yakalayıp işlemler gerçekleştirebiliriz
    //!    .catch((error) => console.log(error)) // Hata varsa yakalar

    try {
        const response = await fetch(url, options) // API ye, url i ve options ı kullanarak istek at ve bekle 
        const result = await response.json() // Gelen cevabı json a çevir ve bekle

        pElement.innerHTML = result.result // API den gelen cevabı oluşturduğumuz p etiketinin içerisine aktardık

    } catch (error) {
        console.log(error)
    }

    incomingChatDiv.querySelector(".typing-animation").remove() // Animasyonu kaldırmak için querySelector ile seçtip remove ile kaldırdık
    const detailDiv = incomingChatDiv.querySelector(".chat-details") // API den gelen cevabı ekrana aktarabilmek için chat-details i seçip bir değişkene aktardık
    detailDiv.appendChild(pElement) // Bu detail içerisine oluşturduğumuz pElement etiketini aktardık

    chatInput.value = ""
}

const showTypingAnimation = () => {
    const html = `
            <div class="chat-content">
                <div class="chat-details">
                    <img src="images/chatbot.jpg" alt="">
                    <div class="typing-animation">
                        <div class="typing-dot" style="--delay: 0.2s"></div>
                        <div class="typing-dot" style="--delay: 0.3s"></div>
                        <div class="typing-dot" style="--delay: 0.4s"></div>
                    </div>
                </div>
            </div>
    `

    const incomingChatDiv = createElement(html, "incoming")
    chatContainer.appendChild(incomingChatDiv)
    getChatResponse(incomingChatDiv)
}

const handleOutGoingChat = () => {
    userText = chatInput.value.trim() // Input un içerisinde bulunun değeri al ve  fazladan boşlukları sil(trim())

    //* Input un içerisinde veri yoksa fonksiyonu burada durdur
    if (!userText) {
        alert("Please enter a data")
        return
    }
    const html = `
            <div class="chat-content">
                <div class="chat-details">
                    <img src="images/user.jpg" alt="">
                    <p></p>
                </div>
            </div>    
    `

    //* Kullanıcının mesajını içeren bir div oluştur ve bunu chatContainer yapısına ekle
    const outgoingChatDiv = createElement(html, "outgoing")
    defaultText.remove() // Başlangıçta gelen varsayılan yazıyı kaldırdık  "ChatGPT Clone"
    outgoingChatDiv.querySelector("p").textContent = userText
    chatContainer.appendChild(outgoingChatDiv)
    setTimeout(showTypingAnimation, 500)
}

//! Olay izleyicileri
sendButton.addEventListener("click", handleOutGoingChat)

//* Textarea içerisinde klavyeden herhangi bir tuşa bastığımız anda bu olay izleyicisi çalışır
chatInput.addEventListener("keydown", (e) => {

    //* Klavyeden Enter tuşuna basıldığında handleOutGoingChat fonksiyonu çalışır
    if (e.key === "Enter") {
        handleOutGoingChat()
    }
})

//* Themebutton a her tıkladığımızda body ye light-mode class ını ekle ve çıkar
themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode")

    //* Body light_mode class ını içeriyorsa themeButton içerisindeki yazıyı dark_mode yap, içermiyorsa light_mode yap
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode"
})

//* Sil butonuna tıkladığımızda chat-container div ini sil ve yerine defaultText i aktar
deleteButton.addEventListener("click", () => {

    //* Confirm ile ekrana bir mesaj bastırdık. Confirm, bize true ve false değer gönderdi
    //* Tamam butonuna basıldığında true gönderir
    //* İptal butonuna basıldığında false gönderir
    if (confirm("Are you sure to delete the all chat ?")) {
        chatContainer.remove()
    }

    const defaultText = `
       <div class="default-text">
          <h1>ChatGPT Clone</h1>
       </div>
       <div class="chat-container"></div>
       <div class="typing-container">
        <div class="typing-content">
            <div class="typing-textarea">
                <textarea id="chat-input" placeholder="Write here..."></textarea>
                <span class="material-symbols-outlined" id="send-btn"> send </span>
            </div>
            <div class="typing-controls">
                <span class="material-symbols-outlined" id="theme-btn">
                    light_mode
                </span>
                <span class="material-symbols-outlined" id="delete-btn">
                    delete
                </span>
            </div>
         </div>
        </div>
    `
})