import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
//import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Button } from './Button';
import { FOLLOW } from '../../apollo/mutations';

class FollowButton extends Component {
	constructor(props) {
		super(props);
		const { isFollowing } = this.props;
		this.state = {
			isFollowing,
		};
	}

	flipFollow = () => this.setState(prev => ({ isFollowing: !prev.isFollowing }))

	follow = () => this.flipFollow();

	unfollow = () => this.flipFollow();

	render() {
		console.log('props: ', this.props);
		const {
			id,
			followId,
			isFollowing,
			name,
		} = this.props;
		return (
			<Mutation mutation={FOLLOW} ignoreResults>
				{(follow, _) => {
					const updateFollow = (isFollowingParam) => {
						console.log('isFollowing: ', isFollowing);
						follow({
							variables: {
								id,
								followId,
								isFollowing: isFollowingParam,
							},
							optimisticResponse: {
								follow: {
									id: followId,
									//name,
									isFollowing,
									__typename: 'User',
								},
							},
							update: (store, data) => {
								console.log('updateFollow store: ', store);
								console.log('updateFollow data: ', data);
								const storeData = store.readFragment({
									id: followId,
									fragment: gql`
									fragment User on User {
										isFollowing
									}
									`,
									// variables: {id:this.props.user.id},
								});
								// console.log('storeData: ',storeData);

								store.writeFragment({
									id: followId,
									fragment: gql`
										fragment User on User {
											isFollowing
										}
									`,
									data: {
										...storeData,
										isFollowing: data.data.follow.isFollowing,
									},
								});

								// store.writeQuery({query: GET_QUEUE, data: storeData})
							},
						});
					};
					return isFollowing ? (
						<Button
							invertColors
							textStyle={styles.buttonText}
							onPress={() => updateFollow(!isFollowing)}
						>
							{ 'Following' }
						</Button>
					) : (
						<Button
							buttonStyle={styles.buttonStyle}
							textStyle={styles.buttonText}
							onPress={() => updateFollow(!isFollowing)}
						>
							{ 'Follow' }
						</Button>
					);
				}}
			</Mutation>
		)
	}
}

// FollowButton.defaultProps = {
// 	id: 0,
// 	followerId: 0,
// 	isFollowing: false,
// };

// FollowButton.propTypes = {
// 	id: PropTypes.integer,
// 	followerId: PropTypes.integer,
// 	isFollowing: PropTypes.boolean,
// };

const styles = StyleSheet.create({
	buttonStyle: {
		borderRadius: 10,
		minWidth: 70,
		// padding: 4,
	},
	buttonText: {
		fontSize: 12,
		fontWeight: '500',
		padding: 4,
	},
});

export { FollowButton };
