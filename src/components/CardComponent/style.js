import {
    Card
} from "antd";
import styled from "styled-components";

export const WrapperCardStyle = styled(Card)
`
    width: 200px;
    & img {
    height:200px;
    width:200px;

`


export const StyleNameProduct = styled.div `
font-weight:400;
font-size: 12px;
line-height:16px;
color: rgb(56,56,61);
`
export const WrapperReporText = styled.div `
font-size: 10px;
color : rgb(128 ,128,137);
display: flex;
align-items: center;
margin: 6px 0 0px;
`

export const WrapperPriceText = styled.div `
font-size: 16px;
color : rgb(255,66,78);
font-weight: 500;

`

export const WrapperDiscountText = styled.span `
font-size: 12px;
color : rgb(255,66,78);
font-weight: 500;
`