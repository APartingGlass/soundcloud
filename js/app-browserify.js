"use strict";
require("es5-shim")
require("babel/register")
var Promise = require('es6-promise').Promise
var $ = require('jquery')
var _ = require('underscore')
var Backbone = require('backbone')
var React = require('react')

//essentials
var apikey = `c1e08233049fb45bea793e4c0e7e4b27`
var secret = `ff73e90235bd4bd416f27ebd9db2f3fb`
var qs = (s, d) => (d || document).querySelector(s)

// Runs the SC obj from sdk-2.0.0 and authenticates our credentials with SoundCloud
SC.initialize({
    client_id: apikey,
})

// Each track's information represented with model
var SoundcloudModel = Backbone.Model.extend({
    idAttribute: 'id',
    url: function() {
        return `https://api.soundcloud.com/tracks/${this.id}?client_id=${apikey}`
    }
})

// A query search of tracks represented by collection
var SoundSearchCollection = Backbone.Collection.extend({
    initialize: function() {
        this.on('sync', console.log(this))
    },
    url: function() {
        return `https://api.soundcloud.com/tracks?q=${this.get('query')}&client_id=${apikey}`
    }
})

class ListItem extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        var artwork_url = this.props.item.attributes.artwork_url,
            title = this.props.item.attributes.title
        return (<li>
                        <h3>{title}</h3> 
                        <img src={artwork_url}/>
                        </li>)
    }
}

class ListView extends React.Component {
    constructor(props) {
        super(props)
        this.props.items.on('sync', () => this.forceUpdate())
    }
    render() {
        return (<div>
                        <ul>
                            {this.props.items.models.map((x) => <ListItem id={x.id} item={x}/>)}
                        </ul>
                    </div>)}
}

var test = new SoundSearchCollection
test.query = 'rock and roll'
React.render(<ListView title='testing' items ={test}/>, qs('.container'))
test.fetch()
