export function If({cond, children}){
    return cond ? children : <></>;
}