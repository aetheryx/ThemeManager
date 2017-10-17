const e = window.DI.React.createElement;

class SettingsDivider extends window.DI.React.Component {
    render () {
        return e('div', { className: 'divider-1G01Z9 marginTop4-2rEBfJ marginBottom20-2Ifj-2',
            style: {
                height: '1.1px' // because electron makes my dividers unvisible randomly if they're 1px
            } });               // and setting it to 1.1px for some reason fixes it ¯\_(ツ)_/¯
    }
}

module.exports = SettingsDivider;