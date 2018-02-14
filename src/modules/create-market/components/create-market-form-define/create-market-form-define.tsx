/* eslint jsx-a11y/label-has-for: 0 */
/* eslint react/no-array-index-key: 0 */
import React, { Component } from "react";
import classNames from "classnames";
import {
  DESCRIPTION_MAX_LENGTH,
  TAGS_MAX_LENGTH
} from "modules/create-market/constants/new-market-constraints";
import { ExclamationCircle as InputErrorIcon } from "modules/common/components/icons/icons";
import Styles from "modules/create-market/components/create-market-form-define/create-market-form-define.styles";
import StylesForm from "modules/create-market/components/create-market-form/create-market-form.styles";
type CreateMarketDefineProps = {
  newMarket: object,
  updateNewMarket: (...args: any[]) => any,
  categories: any[],
  validateField: (...args: any[]) => any
};
type CreateMarketDefineState = {
  suggestedCategories: any,
  shownSuggestions: number,
  suggestedCategories: any,
  shownSuggestions: number
};
export default class CreateMarketDefine extends Component<
  CreateMarketDefineProps,
  CreateMarketDefineState
> {
  constructor(props) {
    super(props);
    this.state = {
      suggestedCategories: this.filterCategories(this.props.newMarket.category),
      shownSuggestions: 2
    };
    this.filterCategories = this.filterCategories.bind(this);
    this.updateFilteredCategories = this.updateFilteredCategories.bind(this);
    this.validateTag = this.validateTag.bind(this);
  }
  filterCategories(category) {
    const userString = category.toLowerCase();
    return this.props.categories.filter(
      cat => cat.category.toLowerCase().indexOf(userString) === 0
    );
  }
  updateFilteredCategories(userString, clearSuggestions = false) {
    let filteredCategories = this.filterCategories(userString);
    if (userString === "" || clearSuggestions) {
      filteredCategories = [];
    }
    this.setState({
      suggestedCategories: filteredCategories,
      shownSuggestions: 2
    });
  }
  validateTag(fieldName, value, maxLength, isRequired = true) {
    const p = this.props;
    const { currentStep } = p.newMarket;
    const updatedMarket = { ...p.newMarket };
    const compareFields = ["tag1", "tag2", "category"];
    const compareValues = [];
    compareFields.indexOf(fieldName) !== -1 &&
      compareFields.splice(compareFields.indexOf(fieldName), 1);
    compareFields.forEach(value => {
      if (p.newMarket[value] !== "") compareValues.push(p.newMarket[value]);
    });
    switch (true) {
      case typeof value === "string" && !value.length && isRequired:
        updatedMarket.validations[currentStep][fieldName] =
          "This field is required.";
        break;
      case maxLength && value.length > maxLength:
        updatedMarket.validations[currentStep][
          fieldName
        ] = `Maximum length is ${maxLength}.`;
        break;
      case compareValues.indexOf(value) !== -1:
        updatedMarket.validations[currentStep][fieldName] =
          "Tag and category names must be unique.";
        break;
      default:
        updatedMarket.validations[currentStep][fieldName] = true;
    }
    updatedMarket[fieldName] = value;
    updatedMarket.isValid = p.isValid(currentStep);
    p.updateNewMarket(updatedMarket);
  }
  render() {
    const p = this.props;
    const s = this.state;
    return (
      <ul className={StylesForm.CreateMarketForm__fields}>
        <li className={Styles.CreateMarketDefine__question}>
          <label htmlFor="cm__input--desc">
            <span>Market Question</span>
          </label>
          <input
            id="cm__input--desc"
            type="text"
            className={classNames({
              [`${StylesForm["CreateMarketForm__error--field"]}`]: p.newMarket
                .validations[p.newMarket.currentStep].description.length
            })}
            value={p.newMarket.description}
            maxLength={DESCRIPTION_MAX_LENGTH}
            placeholder="What question do you want the world to predict?"
            onChange={e =>
              p.validateField(
                "description",
                e.target.value,
                DESCRIPTION_MAX_LENGTH
              )
            }
          />
          <div className={Styles["CreateMarketDefine__question-disclaimer"]}>
            The Augur platform does not work well for markets that are
            subjective or ambiguous. If you&#39;re not sure that the
            market&#39;s outcome will be known beyond a reasonable doubt by the
            expiration date, you should not create this market.
          </div>
        </li>
        <li className={StylesForm["field--50"]}>
          <label htmlFor="cm__input--cat">
            <span>Category</span>
            {p.newMarket.validations[p.newMarket.currentStep].category
              .length && (
              <span className={StylesForm.CreateMarketForm__error}>
                {InputErrorIcon}
                {p.newMarket.validations[p.newMarket.currentStep].category}
              </span>
            )}
          </label>
          <input
            ref={catInput => {
              this.catInput = catInput;
            }}
            id="cm__input--cat"
            className={classNames({
              [`${StylesForm["CreateMarketForm__error--field"]}`]: p.newMarket
                .validations[p.newMarket.currentStep].category.length
            })}
            type="text"
            value={p.newMarket.category}
            maxLength={TAGS_MAX_LENGTH}
            placeholder="Help users find your market by defining its category"
            onChange={e => {
              this.updateFilteredCategories(e.target.value);
              this.validateTag("category", e.target.value, TAGS_MAX_LENGTH);
            }}
          />
        </li>
        <li className={StylesForm["field--50"]}>
          <label>
            <span>Suggested Categories</span>
          </label>
          <ul className={Styles["CreateMarketDefine__suggested-categories"]}>
            {p.newMarket.category &&
              s.suggestedCategories
                .slice(0, s.shownSuggestions)
                .map((cat, i) => (
                  <li key={i}>
                    <button
                      onClick={() => {
                        this.updateFilteredCategories(cat.category, true);
                        this.catInput.value = cat.category;
                        this.validateTag(
                          "category",
                          cat.category,
                          TAGS_MAX_LENGTH
                        );
                      }}
                    >
                      {cat.category}
                    </button>
                  </li>
                ))}
            {p.newMarket.category &&
              s.suggestedCategories.length > s.shownSuggestions && (
                <li>
                  <button
                    onClick={() =>
                      this.setState({
                        shownSuggestions: s.suggestedCategories.length
                      })
                    }
                  >
                    + {s.suggestedCategories.length - 2} more
                  </button>
                </li>
              )}
          </ul>
        </li>
        <li className={Styles.CreateMarketDefine__tags}>
          <label htmlFor="cm__input--tag1">
            <span>Tags</span>
            {(p.newMarket.validations[p.newMarket.currentStep].tag1.length ||
              p.newMarket.validations[p.newMarket.currentStep].tag2.length) && (
              <span className={StylesForm.CreateMarketForm__error}>
                {InputErrorIcon}
                {p.newMarket.validations[p.newMarket.currentStep].tag1}
              </span>
            )}
          </label>
          <input
            id="cm__input--tag1"
            type="text"
            className={classNames({
              [`${StylesForm["CreateMarketForm__error--field"]}`]: p.newMarket
                .validations[p.newMarket.currentStep].tag1.length
            })}
            value={p.newMarket.tag1}
            maxLength={TAGS_MAX_LENGTH}
            placeholder="Tag 1"
            onChange={e =>
              this.validateTag("tag1", e.target.value, TAGS_MAX_LENGTH, false)
            }
          />
          <input
            id="cm__input--tag2"
            type="text"
            className={classNames({
              [`${StylesForm["CreateMarketForm__error--field"]}`]: p.newMarket
                .validations[p.newMarket.currentStep].tag2.length
            })}
            value={p.newMarket.tag2}
            maxLength={TAGS_MAX_LENGTH}
            placeholder="Tag 2"
            onChange={e =>
              this.validateTag("tag2", e.target.value, TAGS_MAX_LENGTH, false)
            }
          />
        </li>
      </ul>
    );
  }
}
