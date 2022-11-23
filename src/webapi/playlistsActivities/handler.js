class PlaylistsActivitiesHandler {
  constructor (playlistsService, activitiesService) {
    this._activitiesService = activitiesService
    this._playlistsService = playlistsService

    this.getActivityById = this.getActivityById.bind(this)
  }

  async getActivityById ({ params, auth }) {
    const { id: userId } = auth.credentials
    const { id: playlistId } = params

    await this._playlistsService.verifyAccess(playlistId, userId)

    const activities = await this._activitiesService.getById(playlistId)

    return {
      status: 'success',
      data: {
        playlistId,
        activities
      }
    }
  }
}

module.exports = PlaylistsActivitiesHandler
