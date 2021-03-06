import React, {Component} from 'react';

import http from "../../services/http.service";
import Loading from "../../Loading";
import './game-page.styles.scss';
import {UpdateModal} from "../../components/game-update/game-update-modal.component";
import {DeleteModal} from "../../components/game-delete/game-delete-modal.component";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBuilding, faCalendarDay, faClock, faPowerOff, faStar, faUsers} from "@fortawesome/free-solid-svg-icons";
import YouTube from 'react-youtube-embed'
import SocialFooter from "../../components/social-footer/social-footer.component";
//import axios from "axios";

class GamePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            game: {
                id: null,
                title: "",
                description: "",
                releaseDate: "",
                developer: "",
                publisher: "",
                engine: "",
                price: "",
                review: "",
                posterUrl: "",
                coverUrl: "",
                trailerUrl: "",
                adUrl: "",
                gameHasFieldsById: []
            },
            sysRequirementsBySysRequirementId: [],
            loading: undefined,
            done: undefined,
            show: false,
            showDelete: false,

            platforms: [],
            sysRequirements: [],
            genres: [],
            modes: [],
            pegiRatings: []
        }
    }

    componentDidMount() {
        this.getGame(this.props.match.params.id);
    }

    getGame(id) {
        this.setState({loading: undefined});
        this.setState({done: undefined});

        //getting the data from all the tables that are connected with game{id}
        http.all([
                http.get("/games/" + id),
                http.get("/games/platforms"),
                http.get("/games/sys-requirements"),
                http.get("/games/genres"),
                http.get("/games/modes"),
                http.get("/games/pegi-rating")
            ])
            .then(
                http.spread(
                    (...responses) => {
                        this.setState({game: responses[0].data})
                        this.setState({platforms: responses[1].data})
                        this.setState({sysRequirements: responses[2].data})
                        this.setState({genres: responses[3].data})
                        this.setState({modes: responses[4].data})
                        this.setState({pegiRatings: responses[5].data})
                    }
                )
            )
            .then(() => {
                this.setState({loading: true});
                setTimeout(() => {
                    this.setState({done: true});
                },500)
            })
            .catch((e) => {
                console.log(e);
            });

    }

    close = () => this.setState({show: false});

    showModal = () => this.setState({show: true})

    closeDelete = () => this.setState({showDelete: false});

    showDeleteModal = () => this.setState({showDelete: true});

    render() {
        const { game, done, loading, show, showDelete} = this.state;

        const link = game.trailerUrl;

        return (



            <div className='game-page' style={{
                backgroundImage: `url(${game.coverUrl})`
            }} >

                {!done?
                    (<Loading loading={loading} />)
                    :
                    (<div>
                        <div
                            className='banner'
                            style={{
                                backgroundImage: `url(${game.coverUrl})`
                            }}
                        />
                        <div className='title'>
                            <span className='game-name'>
                                {game.title}
                            </span>

                            <p className='game-rating'>
                                {game.review}/10
                                <FontAwesomeIcon icon={faStar} className="Icon clockIcon" size={"1x"}/>
                            </p>

                            <div className='game-description'>
                                {game.description}
                            </div>

                            <div className="item">
                                <p ><FontAwesomeIcon icon={faCalendarDay} className="Icon clockIcon" size={"1x"}/>
                                    ReleaseDate <span className="highLight2">{game.releaseDate}</span>

                                    <FontAwesomeIcon icon={faUsers} className="Icon clockIcon" size={"1x"}/>
                                    Developer <span className="highLight2">{game.developer}</span>

                                    <FontAwesomeIcon icon={faBuilding} className="Icon clockIcon" size={"1x"}/>
                                    Publisher <span className="highLight2">{game.publisher}</span>

                                    <FontAwesomeIcon icon={faPowerOff} className="Icon clockIcon" size={"1x"}/>
                                    Engine <span className="highLight2">{game.engine}</span>
                                </p>
                            </div>
                        </div>

                        <div className='nav-bar'>
                            { showDelete ? <div onClick={this.closeDelete} className='back-drop show'/> : <div className='back-drop'/> }
                            <button onClick={ this.showDeleteModal } className="btn-medium btn-openModal">Delete Game</button>
                        </div>
                        <DeleteModal showDelete={showDelete} closeDelete={this.closeDelete} state={this.state.game}/>

                        <div className='nav-bar'>
                            { show ? <div onClick={this.close} className='back-drop show'/> : <div className='back-drop'/> }
                            <button onClick={ this.showModal } className="btn-medium btn-openModal btn-updateModal">Update Game</button>
                        </div>
                        <UpdateModal show={show} close={this.close} state={this.state}/>

                        <div className='fields'>
                            <div className='fields-header'>
                                Release Trailer
                            </div>

                            <div className='fields-item'>

                                <div className='game-description'>
                                    <YouTube className='youtube' id={link}/>
                                </div>

                                {/*<div className='game-description'>*/}
                                {/*    {game.price}*/}
                                {/*</div>*/}

                                {/*<div className='game-description'>*/}
                                {/*    {game.review}*/}
                                {/*</div>*/}
                            </div>
                        </div>

                        <div className='instructions'>
                            <div className='instructions-header'>
                                Other Fields
                            </div>

                            <div className='instructions-item'>
                                {game.gameHasFieldsById.map((field) => (
                                    <div key={field.id}>
                                        <div>Platform: {field.platformByPlatformId.name} </div>

                                        <div>Genre: {field.genreByGenreId.name} </div>

                                        <div>Mode: {field.modeByModeId.name} </div>

                                        <div>Pegi Rating:{field.pegiRatingsByPegiRatingId.rating} </div>

                                        <br/>

                                        <div>
                                            <p><strong>SYS REQ</strong></p>
                                            <div>CPU: {field.sysRequirementsBySysRequirementId.cpu} </div>
                                            <div>GPU: {field.sysRequirementsBySysRequirementId.gpu} </div>
                                            <div>MEMORY: {field.sysRequirementsBySysRequirementId.memory} </div>
                                            <div>STORAGE: {field.sysRequirementsBySysRequirementId.storage} </div>
                                            <div>OS: {field.sysRequirementsBySysRequirementId.os} </div>
                                        </div>

                                        <br/>

                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>)
                }
                <SocialFooter/>
            </div>
        );

    }

}

export default GamePage;