import { useSharedState } from "../Hooks/useSharedState";

type Theme = {
  type: string
};

const UpdateTheme = () => {
  function specificInstanceMiddleware(val: Theme, next :(val: Theme) => void) {
    console.log(`Local Middleware : This Middleware runs only for instance of UpdateTheme Component with value ${val}`)
    next(val)
  }
    // example of inline encapuslated middlewares
    const [theme, setTheme] = useSharedState<Theme>('theme',{
      middleware : [specificInstanceMiddleware] // [array of functions]
    });

    const handleClick = () => {
      let newTheme = {...theme, type : theme.type == 'light' ? 'dark' : 'light'}
      setTheme(newTheme)

    }
  return (<button onClick={() => handleClick()}>
    {`Update theme to ${theme.type == 'light' ? 'dark' : 'light'}`}
    </button>)
}

export default UpdateTheme