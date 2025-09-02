import { FC, HTMLAttributes } from 'react'
import styles from './arrowButton.module.scss'
import classNames from 'classnames'

interface ArrowButtonProps extends HTMLAttributes<HTMLDivElement> {
  type?: "outline" | "fill", 
  orientation?: "left" | "right",
  color?: string,
}

const ArrowButton:FC<ArrowButtonProps> = ({type = "fill", orientation = "right", color = "#42567A", ...props}) => {
  return (
    <div {...props} className={classNames(styles['arrowButton'], styles[orientation], styles[type], props.className)}>
      <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.49988 0.750001L2.24988 7L8.49988 13.25" stroke={color} strokeWidth="2"/>
      </svg>
    </div>
  )
}

export default ArrowButton