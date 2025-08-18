import { Icon } from '@iconify/react'

const IconRender = (props) => {
    return (
        <Icon
            icon={props.icon.icon}
            flip={props.icon.metadata.hFlip ? props.icon.metadata.flip : 0}
            rotate={props.icon.metadata.rotate}
            width={props.icon.metadata.size.width}
            height={props.icon.metadata.size.height}
            style={{ color: props.icon.metadata.color.hex }}
        />
    )
}

export default IconRender;