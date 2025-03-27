import { useState } from 'react'

const Toggable = ({ buttonLabel, children }) => {
    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={() => setVisible(true)}>{buttonLabel}</button>
            </div>

            <div style={showWhenVisible}>
                {children}
                <button onClick={() => setVisible(false)}>cancel</button>
            </div>
        </div>
    )
}

export { Toggable }
