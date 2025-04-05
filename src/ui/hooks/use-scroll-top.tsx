import {useState, useEffect} from "react"

export default function userScrollTop(threshold = 10):boolean {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() =>{

        function handleScroll() {
            if(window.scrollY > threshold){
                setScrolled(true);
            }
            else{
                setScrolled(false);
            }
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [threshold])

    return scrolled;
}