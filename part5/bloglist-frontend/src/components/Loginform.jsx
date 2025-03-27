const LoginForm = (
    { username, password, handlesubmit,
        handleUsernameChange, handlePasswordChange }) => (
    <form onSubmit={handlesubmit}>
        <div>
            username
            <input
                type="text"
                value={username}
                name="Username"
                onChange={handleUsernameChange}
            />
        </div>
        <div>
            password
            <input
                type="password"
                value={password}
                name="Password"
                onChange={handlePasswordChange}
            />
        </div>
        <button type="submit">login</button>
    </form>
)

export { LoginForm }