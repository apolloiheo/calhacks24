"use client"
import Link from "next/link"
 
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import styles from './Layout.module.scss';

import { fetchAccessToken } from "@humeai/voice";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div className={styles.container}>
            <div className={styles.navbar}>
            <NavigationMenu>
                <NavigationMenuList className='gap-10'>
                    <NavigationMenuItem>
                    <Link href="/docs" passHref>
                        <NavigationMenuLink className={`bg-transparent hover:bg-transparent ${navigationMenuTriggerStyle()}`}>
                            Documentation
                        </NavigationMenuLink>
                    </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                    <Link href="/docs" passHref>
                        <NavigationMenuLink className={`bg-transparent hover:bg-transparent ${navigationMenuTriggerStyle()}`}>
                            Speeches
                        </NavigationMenuLink>
                    </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                    <Link href="/" passHref>
                        <NavigationMenuLink className={`bg-transparent hover:bg-transparent ${navigationMenuTriggerStyle()}`}>
                            <h1 style={{fontSize: 25, fontFamily: 'MonumentGrotesk Arial', color: 'hsl(221.2, 83.2%, 53.3%)'}}>Speak Smart</h1>
                        </NavigationMenuLink>
                    </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                    <Link href="#" passHref>
                        <NavigationMenuLink className={`bg-transparent hover:bg-transparent ${navigationMenuTriggerStyle()}`}>
                            Practices
                        </NavigationMenuLink>
                    </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                    <Link href="#" passHref>
                        <NavigationMenuLink className={`bg-transparent hover:bg-transparent ${navigationMenuTriggerStyle()}`}>
                            Profile
                        </NavigationMenuLink>
                    </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            </div>
            {children}
        </div>
    )
}