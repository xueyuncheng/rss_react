export type Dinner = {
  id: number
  name: string
  weight: number
}

export type WhatToEatDinner = {
  night_snack_id: number
  night_snack_name: string
}

export type Podcast = {
  id: number
  title: string
  description: string
  image_url: string
  updated_at: string
}

export type PodcastEpisode = {
  id: number
  title: string
  description: string
  audio_url: string
  published_at: string
  duration: string
}
