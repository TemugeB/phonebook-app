const Notification = ({message}) => {
    if (message[0] === null){
        return null
    }

    const notificationStyle = {
        color: message[1] === true ? 'red' : 'green',
        borderStyle: 'solid',
        borderRadius: 5,
        fontSize: 20,
        fontWeight: 600,
        backgroundColor: 'azure',
        width: 600,
    }

    return (
        <div className="error" style={notificationStyle}>{message}</div>
    )
}

export default Notification