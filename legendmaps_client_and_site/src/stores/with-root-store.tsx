import React from "react";
import { RootStore, rootStore } from "./RootStore";

export type WithRootStoreProps = {
    rootStore: RootStore;
};

export const RootStoreContext = React.createContext<RootStore>(rootStore);

/**
 * A HOC for injecting RootStore into React components as a `store` prop.
 */
export function withRootStore<Props>(Component: React.ComponentType<Props & WithRootStoreProps>): React.FC<Props> {
    const ComponentWithRootStore: React.FC<Props> = (props) => (
        <RootStoreContext.Consumer>
            {(rootStore) => <Component rootStore={rootStore} {...props} />}
        </RootStoreContext.Consumer>
    );

    return ComponentWithRootStore;
}
