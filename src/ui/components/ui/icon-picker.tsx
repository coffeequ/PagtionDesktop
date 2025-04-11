"use client"

import EmojiPicker, { Theme } from "emoji-picker-react";

import{
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@radix-ui/react-popover";

interface IIconPickerProps{
    onChange: (icon: string) => void;
    children: React.ReactNode;
    asChild?: boolean;
};

export default function IconPicker({ onChange, children, asChild } : IIconPickerProps){
    
    //@ts-ignore
    const resolvedTheme  = window.electronAPI.currentTheme();

    const themeMap = {
        "dark": Theme.DARK,
        "light": Theme.LIGHT
    };

    const currentTheme = (resolvedTheme || "light") as keyof typeof themeMap;

    const theme = themeMap[currentTheme];
    
    return(
        <Popover>
            <PopoverTrigger asChild = {asChild}>
                {children}
            </PopoverTrigger>
            <PopoverContent className="z-[99] p-0 w-full border-none shadow-none">
                <EmojiPicker 
                    height={350}
                    theme={theme}
                    onEmojiClick={(data: { emoji: string; }) => onChange(data.emoji)}
                />
            </PopoverContent>
        </Popover>
    );
}