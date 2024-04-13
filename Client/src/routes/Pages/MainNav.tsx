import {
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Image
} from "@nextui-org/react";

import logoUrl from "../../assets/logo.svg"

export default function MainNav(){
  return(
  <Navbar>
    <NavbarBrand>
      <Image width={100} height={200} src={logoUrl}/>
    </NavbarBrand>
  </Navbar>
  )
}
