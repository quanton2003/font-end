import { Row } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
padding: 10px 0;
background-color: rgb(26, 148, 255);
align-items: center;
gap: 16px;
flex-wrap: nowrap;
width:1270px;

`

export const WrapperTextHeader = styled.span`
    font-size: 18px;
    color: white;
    Font-weight: bold;
`
export const WrapperHeaderAccout = styled.div`
    display: flex;
    align-items: center;
    color: white;
    gap: 10px;
 
`
export const WrapperTextHeaderSmall = styled.span `
font-size: 12px;
color: white;
white-space: nowrap;
`
export const WrapperContentPopup = styled.p `
    cursor: pointer;
    &:hover {
        background: rgb(26,148,255);
        color: #fff;
    }
`
