export default class EvaluationFactory {
  constructor(props: {
    EDGE_PENALTY: number
    CORNER_PENALTY: number
    LARGEST_STACK_BONUS: number
    STACK_VALUE_BONUS: number
  }) {
    this.EDGE_PENALTY = props.EDGE_PENALTY
    this.CORNER_PENALTY = props.CORNER_PENALTY
    this.LARGEST_STACK_BONUS = props.LARGEST_STACK_BONUS
    this.STACK_VALUE_BONUS = props.STACK_VALUE_BONUS
  }

  EDGE_PENALTY: number
  CORNER_PENALTY: number
  LARGEST_STACK_BONUS: number
  STACK_VALUE_BONUS: number
}