import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, get, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://champions-6f17a-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsmentListInDB = ref(database, "endorsmentList")

const writeEndorsmentEl = document.getElementById("write-endorsment")
const publishBtnEl = document.getElementById("publish-btn")
const endorsmentListEl = document.getElementById("endorsment-list")
const senderEl = document.getElementById("sender")
const receiverEl = document.getElementById("receiver")

publishBtnEl.addEventListener("click", function() {
    const endorsmentValue = {
        sender: senderEl.value,
        endorsment: writeEndorsmentEl.value,
        receiver: receiverEl.value, 
        likes: 0
    }
    push(endorsmentListInDB, endorsmentValue)

    clearEndorsmentEls()
})

onValue(endorsmentListInDB, function(snapshot) {
    clearEndorsments()
    if (snapshot.exists()) {
        const dbValuesArray = Object.entries(snapshot.val())
        
        clearEndorsments()
    
        for (let i = dbValuesArray.length - 1; i >= 0 ; i--) {
            let currentEndorsment = {
                sender: dbValuesArray[i][1].sender,
                message: dbValuesArray[i][1].endorsment,
                receiver: dbValuesArray[i][1].receiver,
                likes: dbValuesArray[i][1].likes,
                id: dbValuesArray[i][0]
            }
    
            appendNewEndorsment(currentEndorsment)
        }
    } else {
        endorsmentListEl.innerHTML = "No endorsments here... yet"
    }

})

function appendNewEndorsment(endorsment) {
    let newLiEl = document.createElement("li")

    let newButtonEl = document.createElement("button")

    newButtonEl.innerHTML = `🖤 ${endorsment.likes}`

    newButtonEl.addEventListener("click", async function() {
        let likesRef = ref(database, `endorsmentList/${endorsment.id}`)

        const snapshot = await get(likesRef)

        const currentLikes = snapshot.val().likes
        const newLikes = +currentLikes + 1
        
        await update(likesRef, {likes: newLikes})
        
        newButtonEl.innerHTML = `🖤 ${newLikes}`
    })

    

    newLiEl.innerHTML = `
        <h3>
            To ${endorsment.receiver}
        </h3> 
        <p> 
            ${endorsment.message}
        </p>
        <div> 
            <h3>
                From ${endorsment.sender}
            </h3>
        </div>
    `
    newLiEl.append(newButtonEl) 

    endorsmentListEl.append(newLiEl)
}

function clearEndorsments() {
    endorsmentListEl.innerHTML = ""
}

function clearEndorsmentEls() {
    writeEndorsmentEl.value = ""
    senderEl.value = ""
    receiverEl.value = ""
}