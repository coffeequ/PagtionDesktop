"use client"

import EmojiPicker, { Theme } from "emoji-picker-react";

import{
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@radix-ui/react-popover";
import { useTheme } from "@/providers/theme-providers";

interface IIconPickerProps{
    onChange: (icon: string) => void;
    children: React.ReactNode;
    asChild?: boolean;
};

export default function IconPicker({ onChange, children, asChild } : IIconPickerProps){
    
    const { theme } = useTheme()

    const themeMap = {
        "dark": Theme.DARK,
        "light": Theme.LIGHT
    };

    const currentTheme = (theme || "light") as keyof typeof themeMap;

    //const theme = themeMap[currentTheme];

    const resolvedTheme = themeMap[currentTheme];
    
    return(
        <Popover>
            <PopoverTrigger asChild = {asChild}>
                {children}
            </PopoverTrigger>
            <PopoverContent className="z-[99] p-0 w-full border-none shadow-none">
                <EmojiPicker 
                    height={350}
                    theme={resolvedTheme}
                    onEmojiClick={(data: { emoji: string; }) => onChange(data.emoji)}
                />
            </PopoverContent>
        </Popover>
    );
}