const colorBox = document.getElementById('colorBox');
const generateBtn = document.getElementById('generateBtn');
const copyMess = document.getElementById('copyMessage');
const hexCode = document.getElementById('hexCode');

document.addEventListener('DOMContentLoaded', updateColor);

// 색상 HEX 코드 랜덤생성함수
function getRandomColor() {
    const hexChars = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i++) {
        const RandomIndex = Math.floor(Math.random() * 16);
        color += hexChars[RandomIndex];
    }

    return color;
}


function updateColor() {
    const newCode = getRandomColor();
    colorBox.style.backgroundColor = newCode;
    hexCode.textContent = newCode;
}

generateBtn.addEventListener('click', updateColor);

// 색상코드를 클립보드에 복사하는 함수
hexCode.addEventListener('click', function() {
    const currentHexCode = hexCode.textContent;

    navigator.clipboard.writeText(currentHexCode)
        .then(() => {
            copyMess.classList.add('show');
            // 일정한 시간동안 현시했다가 사라지게 하기
            setTimeout(() => {
                copyMess.classList.remove('show');
            }, 1500);
        })
        .catch(err => {
            console.log('fail copy!', err);
            alert('복사에 실패하였습니다.');
        });
});

// 공백으로 색상변경
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault();
        updateColor();
    }
});