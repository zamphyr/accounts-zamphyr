Template.configureLoginServiceDialogForZamphyr.siteUrl = () => {
	return `${Meteor.absoluteUrl()}/_oauth/zamphyr?close`
}

Template.configureLoginServiceDialogForZamphyr.fields = () => {
	return [{
		property: 'clientId',
		label: 'Client ID'
	},
    {
    	property: 'secret',
    	label: 'Client Secret'
    }]
}
