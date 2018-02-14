import { augur } from "services/augurjs";
import { loadAccountData } from "modules/auth/actions/load-account-data";
import { updateIsLogged } from "modules/auth/actions/update-is-logged";
import logError from "utils/log-error";
import getValue from "utils/get-value";
export const login = (keystore, password, callback = logError) => (
  dispatch,
  getState
) => {
  augur.accounts.login(
    {
      keystore,
      password,
      address: keystore.address
    },
    (err, account) => {
      const address = getValue(account, "keystore.address");
      if (err) return callback(err);
      if (!address) return callback(null, account);
      dispatch(updateIsLogged(true));
      dispatch(
        loadAccountData(
          {
            ...account,
            address,
            meta: {
              address,
              signer: account.privateKey,
              accountType: augur.rpc.constants.ACCOUNT_TYPES.PRIVATE_KEY
            }
          },
          true
        )
      );
      callback(null);
    }
  );
};
