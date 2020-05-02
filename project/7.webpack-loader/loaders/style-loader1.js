function loader(source) {//output.css
    return (
        `
        let style = document.createElement('style');
        style.innerHTML = ${JSON.stringify(source)};
        document.head.appendChild(style);
        `
    )
}

module.exports = loader;