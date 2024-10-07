export type Dinner = {
  id: number
  name: string
  weight: number
}

export type WhatToEatDinner = {
  night_snack_id: number
  night_snack_name: string
}

export type PodcastShow = {
  id: number
  name: string
  description: string
  image_url: string
  updated_at: string
}

export type PodcastEpisode = {
  id: number
  name: string
  description: string
  enclosure_url: string
  published_at: string
  duration: string
}
