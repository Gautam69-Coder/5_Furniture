import { tailChase } from 'ldrs'
tailChase.register()

// Default values shown
const loader = (size,color) => {

    return (
        <l-tail-chase
            size={size || "40"}
            speed="1.75"
            color={color || "black"}
        ></l-tail-chase>
    )
}

export { loader }
