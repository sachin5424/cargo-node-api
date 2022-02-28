import Leftnav from "./Leftnav";
import Topnav from "./Topnav";
import { Route, Switch } from "react-router-dom";
import routes from "../../Route";
import Error404 from "../pages/errors/Error404";
export default function layout() {
    return (
        <>
            <Topnav />
            <div className="d-flex">
                <div className="nav-overflow">
                    <Leftnav />
                </div>
                <div className="content-data">
                    <Switch>
                        {
                            routes.leftNav.map((v, i) => (
                                v.subMenus?.length ?
                                    v.subMenus.map((subMenu) => (
                                        <Route key={subMenu.module || subMenu.url} exact={true} path={v.baseURL + subMenu.url}><subMenu.component /></Route>
                                    )) :
                                    <Route key={v.module || v.url} exact={true} path={v.url}><v.component /></Route>
                            ))
                        }
                        {
                            routes.topNav.map((v, i) => (
                                v.subMenus?.length ?
                                    v.subMenus.map((subMenu) => (
                                        <Route key={subMenu.module || subMenu.url} exact={true} path={v.baseURL + subMenu.url}><subMenu.component /></Route>
                                    )) :
                                    <Route key={v.module || v.url} exact={true} path={v.url}><v.component /></Route>
                            ))
                        }
                        <Route path="*">
                            <Error404 />
                        </Route>
                    </Switch>
                </div>
            </div>
        </>
    );
}