export function parseAddress(addressComponents: []) {
    // Initialize an object to hold the parts of the address we want to extract.
    const address = {
      street_number: '',
      route: '',
      apartment_suite: null, // 'subpremise' is the type for apartment/suite numbers
      city: '',
      state: '',
      zip_code: '',
      zip_code_suffix: ''
    };
  
    // A helper function to find a specific component type in the array.
    const getComponent = (type) => {
      const component = addressComponents.find(c => c.types.includes(type));
      return component || null;
    };
    
    // A helper function to get the value from a component, preferring short_name for state.
    const getValue = (component, useShortName = false) => {
        if (!component) return '';
        return useShortName ? component.short_name : component.long_name;
    }
  
    // Extract each piece of the address.
    address.street_number = getValue(getComponent('street_number'));
    address.route = getValue(getComponent('route'));
    address.apartment_suite = getValue(getComponent('subpremise'));
    
    // For city, 'locality' is the primary type. Fallback to other types if not present.
    const cityComponent = getComponent('locality') || getComponent('sublocality_level_1') || getComponent('administrative_area_level_3');
    address.city = getValue(cityComponent);
  
    // For state, we want the abbreviation, so we use 'short_name'.
    address.state = getValue(getComponent('administrative_area_level_1'), true);
    
    address.zip_code = getValue(getComponent('postal_code'));
    address.zip_code_suffix = getValue(getComponent('postal_code_suffix'));
  
    // Combine the parts into the final desired format.
    const formattedAddress = {
      formatted_address: `${address.street_number} ${address.route}`.trim(),
      apartment_suite: address.apartment_suite, // This will be null if not found
      city: address.city,
      state: address.state,
      zip_code: address.zip_code_suffix ? `${address.zip_code}-${address.zip_code_suffix}` : address.zip_code
    };

    console.log('formattedAddress', formattedAddress)
  
    return formattedAddress;
  }