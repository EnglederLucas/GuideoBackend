const endpoints = document.getElementsByClassName('endpoint-def');

for (end of endpoints) {
    end.onclick = () => {
        let that = end;
        if (that.classList.contains('hide')) {
            that.classList.remove('hide');
        } else {
            that.classList.add('hide');
        }
    };
}