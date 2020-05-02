
function loader(inputSource) {
    return (
        `module.exports = ${JSON.stringify(inputSource)}`
    )
}
module.exports = loader;
