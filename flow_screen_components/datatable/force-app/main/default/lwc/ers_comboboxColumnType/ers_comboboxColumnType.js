import {LightningElement, api} from 'lwc';

export default class ers_comboboxColumnType extends LightningElement {
    @api editable;
    @api fieldName;
    @api keyField;
    @api keyFieldValue;
    @api picklistValues;
    @api value;
    @api alignment
    editMode = false;
    updateAllSelected = false;

    pendingValue;
    pendingUpdateAllSelected = false;

    get options() {
        let _options = [];
        for(const key in this.picklistValues) {
            let option = {};
            // option.label = this.picklistValues[key];
            // option.value = key;
            option.label = key;
            option.value = this.picklistValues[key];
            _options.unshift(option);
        }
        return _options
    }

    get checkBoxLabel() {
        return "Apply to All Selected";
    }

    //bump left/right depending on alignment. For center, we will align the grids on a the cell level
    get valueClass() {
        let _valueClass = "slds-col_bump-right slds-align-middle slds-truncate";
        if(this.alignment.includes("right")) {
            _valueClass = "slds-col_bump-left slds-align-middle slds-truncate";
        } else if(this.alignment.includes("center")) {
            _valueClass = "slds-align-middle slds-truncate";
        }
        return _valueClass;
    }

    //if alignment is center, we align the grid to center
    get cellClass() {
        let _cellClass = "combobox-view__min-height cell__is-editable slds-grid slds-p-vertical_xx-small slds-p-horizontal_x-small slds-var-m-around_xxx-small";
        if(this.alignment.includes("center")) {
            _cellClass += " slds-grid_align-center";
        }
        return _cellClass;
    }

    handleClick(event) {
        let clickedButtonLabel = event.target.label;

        if(clickedButtonLabel === "Apply") {

            this.value = this.pendingValue;
            this.updateAllSelected = this.pendingUpdateAllSelected;
            //We will mimic the standard oncellchange event from lightning datatable
            let draftValue = {};
            let draftValues = [];
            draftValue[this.fieldName] = this.value;
            draftValue[this.keyField] = this.keyFieldValue;
            draftValues.push(draftValue);


            //StreckerCM: Add the updateAllSelected flag and feildName to the custom event
            const customEvent = CustomEvent('combovaluechange', {
                composed: true,
                bubbles: true,
                cancelable: true,
                detail: {
                    fieldName: this.fieldName,
                    updateAllSelected: this.updateAllSelected,
                    draftValues: draftValues
                },
            });

            this.dispatchEvent(customEvent)

            //Reset the Update All Selected Flag
            this.updateAllSelected = false;
        }

        //Clear Pending Edits
        this.pendingValue = undefined;
        this.pendingUpdateAllSelected = false;
        
        this.toggleEditMode();
        //StreckerCM: Remove the popover div
        //TODO: remove focus from popover
        this.refs.editRef.classList.add("slds-hide");

    }

    handleComboboxChange(event) {
        //StreckerCM: Temporary store the combobox value when editing
        this.pendingValue = event.target.value;
    }

    handleCheckBoxChange(event){
        //StreckerCM: Temporary store the update all selected flag when editing
        this.pendingUpdateAllSelected = event.target.checked;
     }

    editCombobox(){
        this.toggleEditMode();
        //StreckerCM: Show the popover div
        //TODO: set focus to div
        this.refs.editRef.classList.remove("slds-hide");
        //this.template.querySelector("lightning-combobox").focus();
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
    }
    
    //remove combobox when not focused
    //ToDo: Make thos work for the popover div
    focusout() {
        if(this.editMode) {
            this.toggleEditMode();
            this.refs.editRef.classList.add("slds-hide");
        }
    }

}
