import Tile, { TileType } from '../tile/Tile';
import Player from '../sprite/Player';
import Box from '../sprite/Box';
import Destination from '../sprite/Destination';
import TileMap from '../tile/TileMap';
import playerSprites from '../../images/player_base.png';
import boxSprites from '../../images/bun.png';
import destinationSprites from '../../images/pillow.png';
import {ActionType, DirectionType} from '../sprite/Sprite';
import Game from '../Game';
import RandomTileMap from '../tile/RandomTileMap';
import PatternTileMap from '../tile/PatternTileMap';
import tilesFloor from '../../images/tiles_floor.png';
import tilesMoon from '../../images/moon.png';
import tilesShadow from '../../images/shadow.png';
import tilesPillar from '../../images/tiles_pillar.png';
import tilesVoid from '../../images/tiles_void.png';
import tilesVoidBorder from '../../images/tiles_void_border.png';
import tilesWater from '../../images/tiles_water.png';
import tilesWaterBorder from '../../images/tiles_water_border.png';
import ResourceLoader from '../resource/ResourceLoader';
import Scene from '../Scene';
import YosterIsland8 from '../font/YosterIsland8';
import tilesYosterIsland8 from '../../images/yoster_island_8_white.png';
import Font from '../font/Font';

export default class Level extends Scene {
    public readonly src: string;
    public readonly tileTypeMap: Array<Array<TileType>> = [[]];
    public readonly playerPosition: [number, number];
    public readonly boxPositionList: Array<[number, number]>;
    public readonly destinationPositionList: Array<[number, number]>;

    public readonly rows: number;
    public readonly columns: number;

    private levelCanvas!: HTMLCanvasElement;
    private levelContext!: CanvasRenderingContext2D;

    private playerTileMap!: TileMap;
    private boxTileMap!: TileMap;
    private destinationTileMap!: TileMap;

    private floorTileMap!: RandomTileMap;
    private moonTileMap!: TileMap;
    private pillarTileMap!: PatternTileMap;
    private shadowTileMap!: TileMap;
    private voidTileMap!: RandomTileMap;
    private voidBorderTileMap!: PatternTileMap;
    private waterTileMap!: RandomTileMap;
    private waterBorderTileMap!: PatternTileMap;

    private font8!: Font;

    private player!: Player;
    private boxList!: Array<Box>;
    private destinationList!: Array<Destination>;

    private moves: number = 0;
    private pushes: number = 0;
    private time: number = 0;
    private won: boolean = false;

    private levelBuffered: boolean = false;

    constructor(
        src: string,
        tileTypeMap: Array<Array<TileType>>,
        playerPosition: [number, number],
        boxPositionList: Array<[number, number]>,
        destinationPositionList: Array<[number, number]>
    ) {
        super();

        this.src = src;
        this.tileTypeMap = tileTypeMap;
        this.playerPosition = playerPosition;
        this.boxPositionList = boxPositionList;
        this.destinationPositionList = destinationPositionList;

        this.rows = tileTypeMap.length;
        this.columns = tileTypeMap[0].length;
    }

    /**
     * Loads the level.
     * @param resourceLoader
     * @param width
     * @param height
     */
    public load = (resourceLoader: ResourceLoader, width: number, height: number): void => {
        // Level canvas
        this.levelCanvas = document.createElement('canvas');
        this.levelCanvas.width = width;
        this.levelCanvas.height = height;

        // Create level context
        const levelContext = this.levelCanvas.getContext('2d');
        if (levelContext === null) {
            throw new Error('2D context not supported');
        }
        this.levelContext = levelContext;

        // Define sprite tile maps
        this.playerTileMap = new TileMap(
            TileMap.createTileTable(resourceLoader.get(playerSprites), 4, 6, 0, 0, 18, 24, 1)
        );
        this.boxTileMap = new TileMap(
            TileMap.createTileTable(resourceLoader.get(boxSprites), 1, 1, 0, 0, 16, 16)
        );
        this.destinationTileMap = new TileMap(
            TileMap.createTileTable(resourceLoader.get(destinationSprites), 1, 1, 0, 0, 16, 16)
        );

        // Define level tile maps
        this.floorTileMap = new RandomTileMap(
            TileMap.createTileTable(resourceLoader.get(tilesFloor), 2, 2, 0, 0, 16, 16),
            RandomTileMap.FLOOR_WEIGHTED_TILE_LIST
        );
        this.moonTileMap = new TileMap(
            TileMap.createTileTable(resourceLoader.get(tilesMoon), 1, 1, 0, 0, 32, 32)
        );
        this.shadowTileMap = new TileMap(
            TileMap.createTileTable(resourceLoader.get(tilesShadow), 1, 1, 0, 0, 16, 16)
        );
        this.pillarTileMap = new PatternTileMap(
            TileMap.createTileTable(resourceLoader.get(tilesPillar), 3, 4, 0, 0, 16, 16),
            PatternTileMap.PILLAR_PATTERN_TILE_DEFINITION_LIST
        );
        this.voidTileMap = new RandomTileMap(
            TileMap.createTileTable(resourceLoader.get(tilesVoid), 3, 2, 0, 0, 16, 16),
            RandomTileMap.VOID_WEIGHTED_TILE_LIST
        );
        this.voidBorderTileMap = new PatternTileMap(
            TileMap.createTileTable(resourceLoader.get(tilesVoidBorder), 4, 4, 0, 0, 8, 8),
            PatternTileMap.BORDER_PATTERN_TILE_DEFINITION_LIST
        );
        this.waterTileMap = new RandomTileMap(
            TileMap.createTileTable(resourceLoader.get(tilesWater), 2, 2, 0, 0, 16, 16),
            RandomTileMap.WATER_WEIGHTED_TILE_LIST
        );
        this.waterBorderTileMap = new PatternTileMap(
            TileMap.createTileTable(resourceLoader.get(tilesWaterBorder), 4, 4, 0, 0, 8, 8),
            PatternTileMap.BORDER_PATTERN_TILE_DEFINITION_LIST
        );

        // Create sprites and set initial position
        this.player = new Player(this.playerTileMap);
        this.player.setCoordinates(this.playerPosition[0], this.playerPosition[1]);

        this.boxList = this.boxPositionList.map((boxPosition) => {
            let box = new Box(this.boxTileMap);
            box.setCoordinates(boxPosition[0], boxPosition[1]);
            return box;
        });

        this.destinationList = this.destinationPositionList.map((destinationPosition) => {
            let destination = new Destination(this.destinationTileMap);
            destination.setCoordinates(destinationPosition[0], destinationPosition[1]);
            return destination;
        });

        // Create bitmap fonts
        this.font8 = new YosterIsland8(resourceLoader.get(tilesYosterIsland8));

        // Reset level state
        this.moves = 0;
        this.pushes = 0;
        this.time = 0;
        this.won = false;

        this.levelBuffered = false;
    };

    /**
     * Controls the player based on the user input.
     */
    public control = (pressedKey: string): void => {
        if (this.player.actionType !== ActionType.Stand) {
            return;
        }

        let actionType;
        let isMoving = false;
        let isPushing = false;

        switch (pressedKey) {
            case 'KeyW':
            case 'ArrowUp':
                // Check up
                actionType = this.controlDirection(DirectionType.Up, 0, -1);
                isPushing = actionType === ActionType.Push;
                isMoving = actionType === ActionType.Walk || actionType === ActionType.Push ;
                break;
            case 'KeyS':
            case 'ArrowDown':
                // Check down
                actionType = this.controlDirection(DirectionType.Down, 0, 1);
                isPushing = actionType === ActionType.Push;
                isMoving = actionType === ActionType.Walk || actionType === ActionType.Push;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                // Check left
                actionType = this.controlDirection(DirectionType.Left, -1, 0);
                isPushing = actionType === ActionType.Push;
                isMoving = actionType === ActionType.Walk || actionType === ActionType.Push;
                break;
            case 'KeyD':
            case 'ArrowRight':
                // Check right
                actionType = this.controlDirection(DirectionType.Right, 1, 0);
                isPushing = actionType === ActionType.Push;
                isMoving = actionType === ActionType.Walk || actionType === ActionType.Push;
                break;
        }

        if (isMoving) {
            this.moves++;
        }

        if (isPushing) {
            this.pushes++;
        }
    };

    /**
     * Updates the level.
     * @param dt
     */
    public update = (dt: number): void => {
        if (!this.won) {
            this.time += dt;

            // Check win condition
            let boxCoordinates: [number, number];
            let destinationCoordinates: [number, number];
            this.won = this.boxList
                .map((box) => {
                    boxCoordinates = box.getCoordinates();
                    for (let destinationIndex = 0; destinationIndex < this.destinationList.length; destinationIndex++) {
                        destinationCoordinates = this.destinationList[destinationIndex].getCoordinates();
                        if (boxCoordinates[0] === destinationCoordinates[0] && boxCoordinates[1] === destinationCoordinates[1]) {
                            return true;
                        }
                    }
                    return false;
                })
                .reduce((won: boolean, isAtDestination) => won && isAtDestination, true);
        }

        // Update sprites
        this.player.update(dt);
        this.boxList.forEach((box) => {
            box.update(dt);
        });
    };

    /**
     * Draws the level buffer and all sprites.
     * @param bufferCanvas
     * @param bufferContext
     */
    public draw = (bufferCanvas: HTMLCanvasElement, bufferContext: CanvasRenderingContext2D): void => {
        const rowMax = bufferCanvas.height / Game.TILE_HEIGHT;
        const columnMax = bufferCanvas.width / Game.TILE_WIDTH;
        const xOffset = ((columnMax - this.columns) / 2) * Game.TILE_WIDTH;
        const yOffset = ((rowMax - this.rows + 2) / 2) * Game.TILE_HEIGHT;
        const spriteList = [...this.destinationList, ...this.boxList, this.player];

        if (!this.levelBuffered) {
            this.drawLevelToBuffer(rowMax, columnMax, xOffset, yOffset);
            this.levelBuffered = true;
        }

        // Draw level buffer
        bufferContext.imageSmoothingEnabled = false;
        bufferContext.drawImage(this.levelCanvas, 0, 0);

        // Draw shadows
        if (Game.RENDER_SHADOWS) {
            spriteList.forEach((sprite) => {
                this.shadowTileMap.get(0, 0).draw(xOffset + sprite.x, yOffset + sprite.y, bufferContext);
            });
        }

        // Draw sprites
        spriteList.forEach((sprite) => {
            sprite.draw(xOffset, yOffset, bufferContext);
        });

        // Draw status
        this.font8.draw('Moves:', 10, 256, bufferContext);
        this.font8.draw(String(this.moves), 60, 256, bufferContext);
        this.font8.draw('Pushes:', 10, 270, bufferContext);
        this.font8.draw(String(this.pushes), 60, 270, bufferContext);
        this.font8.draw('Time:', 10, 284, bufferContext);
        this.font8.draw(String(Math.floor(this.time)), 60, 284, bufferContext);

        if (this.won) {
            this.font8.draw(
                'You win!',
                bufferContext.canvas.width / 2,
                bufferContext.canvas.height / 2,
                bufferContext
            );
        }
    };

    /**
     * Controls the player for the given direction.
     * @param directionType
     * @param columnOffset
     * @param rowOffset
     */
    private controlDirection = (directionType: DirectionType, columnOffset: number, rowOffset: number): ActionType => {
        let actionType: ActionType | undefined = undefined;

        const playerCoordinates = this.player.getCoordinates();
        const neighborColumnIndex = playerCoordinates[0] + columnOffset;
        const neighborRowIndex = playerCoordinates[1] + rowOffset;

        // Check if neighboring tile of player is floor
        if (this.isTileTypeAt(neighborColumnIndex, neighborRowIndex, TileType.Floor)) {
            // Check if neighboring tile contains a box
            const box = this.isBoxAt(neighborColumnIndex, neighborRowIndex);
            if (box !== undefined) {
                const nextNeighborColumnIndex = neighborColumnIndex + columnOffset;
                const nextNeighborRowIndex = neighborRowIndex + rowOffset;

                // Check if next neighboring tile is floor or contains another box
                if (
                    this.isTileTypeAt(nextNeighborColumnIndex, nextNeighborRowIndex, TileType.Floor) &&
                    this.isBoxAt(nextNeighborColumnIndex, nextNeighborRowIndex) === undefined
                ) {
                    // Can push
                    actionType = ActionType.Push;
                    box.setAction(ActionType.Walk, directionType);
                } else {
                    // Cannot push
                    actionType = ActionType.Stand;
                }
            } else {
                // Can walk
                actionType = ActionType.Walk;
            }
        } else {
            // Cannot walk
            actionType = ActionType.Stand;
        }

        this.player.setAction(actionType, directionType);

        return actionType;
    };

    /**
     * Draws the level to the level buffer.
     * @param rowMax
     * @param columnMax
     * @param xOffset
     * @param yOffset
     */
    private drawLevelToBuffer = (rowMax: number, columnMax: number, xOffset: number, yOffset: number): void => {
        // Clear with background color
        this.levelContext.imageSmoothingEnabled = false;
        this.levelContext.fillStyle = Game.BACKGROUND_COLOR;
        this.levelContext.fillRect(0, 0, this.levelContext.canvas.width, this.levelContext.canvas.height);

        // Draw background
        for (let rowIndex = 0; rowIndex < rowMax; rowIndex++) {
            for (let columnIndex = 0; columnIndex < columnMax; columnIndex++) {
                const tile = this.voidTileMap.getRandomTile();
                tile.draw(columnIndex * tile.width, rowIndex * tile.height, this.levelContext);
            }
        }

        // Draw moon
        const moonTile = this.moonTileMap.get(0, 0);
        moonTile.draw(Game.MOON_OFFSET, Game.MOON_OFFSET, this.levelContext);

        // Draw level
        let pattern: string;
        let tileDefinitionList: Array<[Tile, [number, number]]>;
        let borderTileDefinitionList: Array<[Tile, [number, number]]>;
        for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
                tileDefinitionList = [];

                switch (this.tileTypeMap[rowIndex][columnIndex]) {
                    case TileType.Floor:
                        // Add random floor tile
                        tileDefinitionList.push([this.floorTileMap.getRandomTile(), [0, 0]]);

                        // Add pillar
                        if (Game.RENDER_PILLARS) {
                            // Get pillar tiles
                            pattern = this.getPatternAt(columnIndex, rowIndex, TileType.Floor);
                            borderTileDefinitionList = pattern.match(/......0./)
                                ? this.pillarTileMap.getTileListByPattern(pattern)
                                : [];

                            // Add pillar tiles
                            tileDefinitionList.push(...borderTileDefinitionList);
                        }

                        break;
                    case TileType.Void:
                        // Get border tiles
                        pattern = this.getPatternAt(columnIndex, rowIndex, TileType.Floor);
                        borderTileDefinitionList =
                            pattern !== '00000000' ? this.voidBorderTileMap.getTileListByPattern(pattern) : [];

                        // Add border tiles
                        tileDefinitionList.push(...borderTileDefinitionList);
                        break;
                    case TileType.Water:
                        // Get border tiles
                        pattern = this.getPatternAt(columnIndex, rowIndex, TileType.Floor);
                        borderTileDefinitionList =
                            pattern !== '00000000' ? this.waterBorderTileMap.getTileListByPattern(pattern) : [];

                        // Add tiles
                        tileDefinitionList.push(
                            // Add random water tile if no border tiles exists or default tile otherwise
                            [
                                borderTileDefinitionList.length === 0
                                    ? this.waterTileMap.getRandomTile()
                                    : this.waterTileMap.get(0, 0),
                                [0, 0]
                            ],
                            // Add border tiles
                            ...borderTileDefinitionList
                        );
                        break;
                }

                // Draw tiles
                tileDefinitionList.forEach((tileDefinition) =>
                    tileDefinition[0].draw(
                        tileDefinition[1][0] + xOffset + columnIndex * Game.TILE_WIDTH,
                        tileDefinition[1][1] + yOffset + rowIndex * Game.TILE_HEIGHT,
                        this.levelContext
                    )
                );
            }
        }
    };

    /**
     * Returns a pattern describing the surroundings of the given coordinates.
     * @param columnIndex
     * @param rowIndex
     * @param tileType
     */
    public getPatternAt = (columnIndex: number, rowIndex: number, tileType: TileType): string => {
        // Check all 8 neighboring cells and create pattern describing if they have the given tile type
        return [
            [columnIndex - 1, rowIndex - 1],
            [columnIndex, rowIndex - 1],
            [columnIndex + 1, rowIndex - 1],
            [columnIndex - 1, rowIndex],
            [columnIndex + 1, rowIndex],
            [columnIndex - 1, rowIndex + 1],
            [columnIndex, rowIndex + 1],
            [columnIndex + 1, rowIndex + 1]
        ]
            .map((coordinates) => this.isTileTypeAt(coordinates[0], coordinates[1], tileType))
            .reduce((pattern: string, isGivenTileType: boolean) => pattern.concat(isGivenTileType ? '1' : '0'), '');
    };

    /**
     * Checks if a box is at the given coordinates.
     * @param columnIndex
     * @param rowIndex
     */
    private isBoxAt = (columnIndex: number, rowIndex: number): Box | undefined => {
        let boxCoordinates: [number, number];
        for (let boxIndex = 0; boxIndex < this.boxList.length; boxIndex++) {
            boxCoordinates = this.boxList[boxIndex].getCoordinates();
            if (boxCoordinates[0] === columnIndex && boxCoordinates[1] === rowIndex) {
                return this.boxList[boxIndex];
            }
        }
        return undefined;
    };

    /**
     * Checks if the given tile type is at the given coordinates.
     * @param columnIndex
     * @param rowIndex
     * @param tileType
     */
    public isTileTypeAt = (columnIndex: number, rowIndex: number, tileType: TileType): boolean => {
        // Check if coordinates are valid
        if (
            columnIndex < 0 ||
            columnIndex >= this.tileTypeMap[0].length ||
            rowIndex < 0 ||
            rowIndex >= this.tileTypeMap.length
        ) {
            return false;
        }

        // Check if cell has the given tile type
        return this.tileTypeMap[rowIndex][columnIndex] === tileType;
    };
}
