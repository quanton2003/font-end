import React, { Children } from 'react'
import HeaderComponent from '../HeaderCompoent/HeaderComponent'

const DefaultCompoent = ({children}) => {
  return (
    <div>

       <HeaderComponent/> 
       {children}
        
    </div>
  )
}

export default DefaultCompoent