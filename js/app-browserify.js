"use strict";
require("es5-shim")
require("babel/register")
var Promise = require('es6-promise').Promise
var $ = require('jquery')
var _ = require('underscore')
var Backbone = require('backbone')
var React = require('react')

//essential informations
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
        // this.fetch = _.debounce(this.fetch, 1000)
    },
    url: function() {
        return `https://api.soundcloud.com/tracks.json?client_id=${apikey}&q=${this.query}`
    }
})

//view template of one search item
class ListItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            track: this.props.item.id,
            playing: false,
            position: 0
        }
    }
    checkTime() {
        if (this.state.song) {
            this.setState({position: this.state.song.getCurrentPosition()})
        }
    }
    toggleSong() {
        if (this.state.playing) {
            this.state.song.pause()
        } else {
            if(this.state.song){
                console.log(this.state)
                this.state.song.play()
            } else {
                SC.stream(`/tracks/${this.state.track}`, (sound) => {
                    this.setState({song: sound, total: sound.getDuration()})
                    sound.play()
                    window.setInterval(() => this.checkTime(), 1000)
                })
            }
        }
        this.setState({ playing: !this.state.playing})
    }
    restartSong() {
        if (this.state.song) {
            this.state.song.seek(0)
        }
    }
    render() {
        var artwork_url = this.props.item.attributes.artwork_url,
            title = this.props.item.attributes.title,
            likes = this.props.item.attributes.likes_count,
            played = this.props.item.attributes.playback_count

        return (<div className="player">
                    <div className="top">
                        <div className="album" onClick={() => this.toggleSong()}><img src={artwork_url}/></div>
                        <div className="controls">
                        	<img onClick={() => this.restartSong()} id="replay" src="../images/curvearrow4.svg"/>     
                        	<img id="last"src="../images/speaker113.svg"/>
                			<img src="../images/sound35.svg"/>
                			<h5>{title}</h5>
                        </div>
                        <div className="song_length">
                            <progress data-current={Math.floor(this.state.position /1000)} data-total={Math.floor(this.state.total /1000)}> 
                            </progress>
                        </div>
                    </div>
                    <div className="bottom">
                    	<img className="logo" src="../images/soundcloud3.svg"/>
                    	<p>BUY</p>
                		<img src="../images/play43.svg"/>
                		<h6>{played}</h6>
                		<img src="../images/favorite21.svg"/>
                		<h6>{likes}</h6>
                    </div>
                </div>)
    }
}
//view template of search list
class ListView extends React.Component {
    constructor(props) {
        super(props)
        this.props.items.on('sync', () => this.forceUpdate())
    }   
    render() {
        var models = this.props.items.query ? this.props.items.models : []
        return (<div className='searchList'>
                    {models.map((x) => <ListItem key={x.id} item={x}/>)}
                </div>
                    )}
}
//Header contains 
class Header extends React.Component {
    constructor(props) {
        super(props)
        this.search = this.getSearcher()
    }
    getSearcher() {
        window.searchColl = new SoundSearchCollection 
        React.render(<ListView title='searchResults' items ={searchColl}/>, qs('.results'))
        var search = function () {
            var input = React.findDOMNode(this.refs.searchBox)
            searchColl.query = input.value
            searchColl.fetch()
        }
        return search
    }
    render() {
        return (<div className='searchbar'>
            <img className='logo' src="../images/soundcloud3.svg" />
            <form onChange={(e) => this.search(e)} onSubmit={(e) => e.preventDefault()}>
                <input type="text" ref='searchBox'/>
            </form>
        </div>)
    }
}

React.render(<Header/>, qs('.header'))