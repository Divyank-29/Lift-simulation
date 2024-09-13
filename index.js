const inputPage = document.querySelector("#input-page");
const btnSubmit = document.querySelector("#btn-submit");
const layout = document.querySelector("#layout");

let requestQueue = [];


const checkInput = () => {
    const noOfFloors = parseInt(document.querySelector("#no-of-floors").value);
    const noOfLifts = parseInt(document.querySelector("#no-of-lifts").value);

    if (isNaN(noOfFloors) || isNaN(noOfLifts) || noOfFloors <= 0 || noOfLifts <= 0) {
        alert("Please enter valid numbers for floors and lifts.");
        return;
    }

   
        inputPage.style.display = "none";
        buildFloor(noOfFloors);
        buildLift(noOfLifts);
    
};

btnSubmit.addEventListener("click", checkInput);

const buildFloor = (noOfFloors) => {
    let floorLayout = document.createElement('div');
    floorLayout.setAttribute("class", "floorlay");
    layout.append(floorLayout);

    for (let i = noOfFloors - 1; i >= 0; i--) {
        let floorContainer = document.createElement('div');
        floorContainer.setAttribute("class", "floor");
        floorContainer.setAttribute("id", "floorCont" + i);

        let btnContainer = document.createElement('div');
        btnContainer.setAttribute("class", "btnCont");
        btnContainer.setAttribute("id", "btnCont" + i);

        let upBtn = document.createElement("button");
        upBtn.setAttribute("class", "btn");
        upBtn.setAttribute("data-buttonFloor", i);
        upBtn.setAttribute("data-direction", "Up");
        upBtn.setAttribute("id", "Up")
        upBtn.innerText = "Up";

        let downBtn = document.createElement("button");
        downBtn.setAttribute("class", "btn");
        downBtn.setAttribute("data-buttonFloor", i);
        downBtn.setAttribute("data-direction", "Down");
    downBtn.setAttribute("id" , "Down")
        downBtn.innerText = "Down";

        let floorNumber = document.createElement("p");
        floorNumber.innerText = "Floor " + i;

        if (i == noOfFloors - 1) {
            btnContainer.append(downBtn, floorNumber);
        } else if (i == 0) {
            btnContainer.append(upBtn, floorNumber);
        } else {
            btnContainer.append(upBtn, downBtn, floorNumber);
        }
        floorContainer.append(btnContainer);
        floorLayout.append(floorContainer);
    }
    buttonClick();
};

const buildLift = (noOfLifts) => {
    let liftLayout = document.createElement('div');
    liftLayout.setAttribute("class", "liftLay");

    for (let i = 0; i < noOfLifts; i++) {
        let liftContainer = document.createElement('div');
        liftContainer.setAttribute("class", "lift");
        liftContainer.setAttribute("data-liftFloor", 0);
        liftContainer.setAttribute("liftAvailable", "available");

        let leftGate = document.createElement("div");
        leftGate.setAttribute("class", "lGate");

        let rightGate = document.createElement("div");
        rightGate.setAttribute("class", "rGate");

        liftContainer.append(leftGate, rightGate);
        liftLayout.append(liftContainer);
    }

    document.querySelector("#floorCont0").append(liftLayout);
};

function buttonClick() {
    let buttons = document.querySelectorAll(".btn");
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const floorNo = button.getAttribute("data-buttonFloor");
            const direction = button.getAttribute("data-direction");
            button.disabled = true; 
            AvailableLift(floorNo, direction, button);
        });
    });
}

function AvailableLift(floorNo, direction, button) {
    const liftObj = document.querySelectorAll(".lift");
    let liftArray = Array.from(liftObj);
    let closest = undefined;
    let minDistance = Infinity;

    for (let i = 0; i < liftArray.length; i++) {
        let liftCalled = liftArray[i].getAttribute("data-liftFloor");
        let liftAvailable = liftArray[i].getAttribute("liftAvailable");

        let difference = Math.abs(floorNo - liftCalled);

        if (liftAvailable === "available" && minDistance > difference) {
            closest = i;
            minDistance = difference;
        }
    }

   
    if (closest !== undefined) {
        let floorCalled = liftArray[closest].getAttribute("data-liftFloor");
        let distance = (-6.3) * Number(floorNo);
        let diffInFloors = Math.abs(2 * (Number(floorNo) - floorCalled));
        let currentFloor = Number(floorNo);

        button.disabled = true; 
        moveLift(liftArray, closest, distance, diffInFloors, currentFloor, button);
    } else {
       
        requestQueue.push({ floorNo, direction, button });
    }
}


function moveLift(liftArray, closest, distance, diffInFloors, currentFloor, button) {
    setTimeout(() => {
        liftArray[closest].setAttribute("liftAvailable", "busy");
        liftArray[closest].style.transform = `translateY(${distance}rem)`;
        liftArray[closest].style.transition = `transform ${diffInFloors}s linear`;
        liftArray[closest].setAttribute("data-liftFloor", currentFloor);
    }, 0);

    setTimeout(() => {
        liftArray[closest].children[0].style.transform = `translateX(${-100}%)`;
        liftArray[closest].children[0].style.transition = `transform ${2.5}s linear`;
        liftArray[closest].children[1].style.transform = `translateX(${100}%)`;
        liftArray[closest].children[1].style.transition = `transform ${2.5}s linear`;
    }, (diffInFloors * 1000));

    setTimeout(() => {
        liftArray[closest].children[0].style.transform = `translateX(${0}%)`;
        liftArray[closest].children[0].style.transition = `transform ${2.5}s linear`;
        liftArray[closest].children[1].style.transform = `translateX(${0}%)`;
        liftArray[closest].children[1].style.transition = `transform ${2.5}s linear`;
    }, ((diffInFloors * 1000) + 2500));

    setTimeout(() => {
        liftArray[closest].setAttribute("liftAvailable", "available");
       
        button.disabled = false;

       
        if (requestQueue.length > 0) {
            const nextRequest = requestQueue.shift(); 
            AvailableLift(nextRequest.floorNo, nextRequest.direction, nextRequest.button); 
        }
    }, ((diffInFloors * 1000) + 5000));
}
